from enum import StrEnum, auto
from typing import Any
from pydantic import BaseModel

TIMEOUT = 5
DATETIME_FORMAT = "%Y-%m-%d %H:%M:%S"

COLLECTION = "season_data"
DB_NAME = "vowt"


class DataType(StrEnum):
    SEASON = auto()
    LEAGUES_EPL = auto()
    LEAGUES_VOWT = auto()
    SAVES = auto()


class DataInstance(BaseModel):
    data: Any
    type: DataType


class SourceModel(BaseModel):
    @classmethod
    def source_api(cls, **kwargs: Any) -> str:
        raise NotImplementedError
