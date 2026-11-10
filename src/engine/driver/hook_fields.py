from collections.abc import Mapping

from engine.driver.hook_event_error import HookEventError
from engine.types.type_guards import is_list, is_mapping, is_text_list

Fields = Mapping[str, object] | Mapping[object, object]


def text(data: Fields, key: str) -> str:
    value = data.get(key, "")
    if not isinstance(value, str):
        raise HookEventError(f"{key} is a text, not {value!r}")
    return value


def number(data: Fields, key: str) -> int:
    value = data.get(key, 0)
    if not isinstance(value, int) or isinstance(value, bool):
        raise HookEventError(f"{key} is a whole number, not {value!r}")
    return value


def boolean(data: Fields, key: str) -> bool:
    value = data.get(key)
    if not isinstance(value, bool):
        raise HookEventError(f"{key} is true or false, not {value!r}")
    return value


def texts(data: Fields, key: str) -> tuple[str, ...]:
    value = data.get(key, [])
    if not is_list(value) or not all(isinstance(item, str) for item in value):
        raise HookEventError(f"{key} is a list of texts, not {value!r}")
    return tuple(str(item) for item in value)


def nested_texts(data: Fields, key: str) -> tuple[tuple[str, ...], ...]:
    value = data.get(key, [])
    rows = [row for row in value if is_text_list(row)] if is_list(value) else []
    if not is_list(value) or len(rows) != len(value):
        raise HookEventError(f"{key} is a list of lists of texts, not {value!r}")
    return tuple(tuple(row) for row in rows)


def mapping(value: object, name: str) -> Mapping[object, object]:
    if not is_mapping(value):
        raise HookEventError(f"{name} is an object, not {value!r}")
    return value


def mappings(rows: object, name: str) -> tuple[Mapping[str, object], ...]:
    if not is_list(rows):
        return ()
    return tuple({str(key): value for key, value in mapping(row, name).items()} for row in rows)
