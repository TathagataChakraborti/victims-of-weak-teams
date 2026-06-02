from pymongo import MongoClient
from datetime import datetime
from typing import Optional

from vowt.utils import fetch_source_model
from vowt.schemas.constants import DataType, DataInstance, DB_NAME, COLLECTION, TIMEOUT

from vowt.schemas.season_data import SeasonData, Metadata, StaticData, GameWeekData

import certifi
import os

CONNECTION_STRING = os.getenv("CONNECTION_STRING")


def get_season_info() -> Optional[SeasonData]:
    client = MongoClient(CONNECTION_STRING)

    try:
        db = client[DB_NAME]
        collection = db[COLLECTION]

        data = collection.find_one({"type": DataType.SEASON})
        model_instance = SeasonData.model_validate(data)

        return model_instance

    except Exception as e:
        print(f"No data found: {e}")
        return None

    finally:
        client.close()


def update_season_info(timeout: int = TIMEOUT) -> Optional[SeasonData]:
    local_certificate = certifi.where()
    client = MongoClient(CONNECTION_STRING, tls=True, tlsCAFile=local_certificate)

    client.admin.command("ping")

    db = client[DB_NAME]
    collection = db[COLLECTION]

    try:
        metadata = fetch_source_model(Metadata, timeout)
        static_data = fetch_source_model(StaticData, timeout)

        assert metadata is not None
        assert static_data is not None

        data = SeasonData(
            last_updated=datetime.now(), metadata=metadata, player_data=static_data
        )

        for item in static_data.events.data:
            if item.finished:
                gameweek_data = fetch_source_model(
                    GameWeekData, timeout=timeout, gameweek=item.id
                )

                assert isinstance(gameweek_data, GameWeekData)
                data.gameweek_data.append(gameweek_data)

        collection.delete_one({"type": DataType.SEASON})

        new_data_instance = DataInstance(
            data=data,
            type=DataType.SEASON,
        )

        insert_result = collection.insert_one(new_data_instance.model_dump(mode="json"))
        print(f"Document inserted with ID: {insert_result.inserted_id}")

        return data

    except Exception as e:
        print(f"An error occurred: {e}")
        return None

    finally:
        client.close()
