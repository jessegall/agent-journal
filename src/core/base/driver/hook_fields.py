from collections.abc import Mapping

from core.base.driver.hook_event_error import HookEventError
from core.base.type_guards import is_list, is_mapping


def text(data: Mapping[object, object], key: str) -> str:
    value = data.get(key, "")
    if not isinstance(value, str):
        raise HookEventError(f"{key} is a text, not {value!r}")
    return value


def number(data: Mapping[object, object], key: str) -> int:
    value = data.get(key, 0)
    if not isinstance(value, int) or isinstance(value, bool):
        raise HookEventError(f"{key} is a whole number, not {value!r}")
    return value


def texts(data: Mapping[object, object], key: str) -> tuple[str, ...]:
    value = data.get(key, [])
    if not is_list(value) or not all(isinstance(item, str) for item in value):
        raise HookEventError(f"{key} is a list of texts, not {value!r}")
    return tuple(str(item) for item in value)


def mapping(value: object, name: str) -> Mapping[object, object]:
    if not is_mapping(value):
        raise HookEventError(f"{name} is an object, not {value!r}")
    return value
