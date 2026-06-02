from typing import Any, Optional, TypeVar
from time import sleep
from random import randint
from vowt.schemas.constants import SourceModel

import requests  # type: ignore

T = TypeVar("T", bound=SourceModel)


def fetch_source_model(
    model: type[T], backoff: int = 60, timeout: int = 5, **kwargs: Any
) -> Optional[T]:
    if not isinstance(model, SourceModel):
        url = model.source_api(**kwargs)
    else:
        raise TypeError(f"Generic type {type(model)} does not have a source API.")

    print(f"Reading from {url} ...")
    sleep(randint(a=0, b=backoff))

    try:
        response = requests.get(url, timeout=timeout)

        if response.status_code == 200:
            data = response.json()
            model_instance = model.model_validate(data)

            return model_instance

        else:
            print(f"Failed to retrieve data. Status code: {response.status_code}")
            return None

    except requests.exceptions.RequestException as e:
        print(f"A network error occurred: {e}")
        return None
