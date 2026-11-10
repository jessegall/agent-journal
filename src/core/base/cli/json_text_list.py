import json

from core.base.cli.invalid_text_list import InvalidTextList
from engine.types.type_guards import is_text_list


def json_text_list(text: str) -> list[str]:
    try:
        value: object = json.loads(text)
    except json.JSONDecodeError as error:
        raise InvalidTextList.create(text) from error
    if not is_text_list(value):
        raise InvalidTextList.create(text)
    return list(value)
