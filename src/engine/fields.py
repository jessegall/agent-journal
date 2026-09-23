from dataclasses import fields
from functools import cache
from types import UnionType
from typing import Any, ClassVar, Union, get_args, get_origin, get_type_hints

CONTAINERS = {tuple: (list, tuple), list: (list, tuple), dict: (dict,)}
EMPTY = (None, "", {}, [])


class Loaded:
    aliases: ClassVar[dict] = {}
    keyed_by: ClassVar[str] = ""

    @classmethod
    def from_json(cls, raw: dict):
        given = {}
        for name, kind in declared(cls):
            found = [raw[key] for key in cls.aliases.get(name, (name,)) if raw.get(key) not in EMPTY]
            if found and fits(kind, found[0]):
                given[name] = shaped(kind, found[0])
        return cls(**given)


@cache
def declared(cls) -> tuple:
    hints = get_type_hints(cls)
    return tuple((field.name, hints[field.name]) for field in fields(cls) if field.init)


def plain(kind):
    if get_origin(kind) in (Union, UnionType):
        return next(arg for arg in get_args(kind) if arg is not type(None))
    return kind


def fits(kind, value) -> bool:
    kind = plain(kind)
    base = get_origin(kind) or kind
    if isinstance(base, type) and issubclass(base, Loaded):
        return isinstance(value, dict)
    if base is tuple and keyed(kind):
        return isinstance(value, dict)
    return isinstance(value, CONTAINERS.get(base, object))


def keyed(kind) -> bool:
    item = next(iter(get_args(kind)), None)
    return isinstance(item, type) and issubclass(item, Loaded) and bool(item.keyed_by)


def shaped(kind, value):
    kind = plain(kind)
    base = get_origin(kind) or kind
    if base in (Any, object):
        return value
    if isinstance(base, type) and issubclass(base, Loaded):
        return base.from_json(value)
    if base is tuple and keyed(kind):
        item = get_args(kind)[0]
        return tuple(item.from_json({**one, item.keyed_by: key}) for key, one in value.items() if isinstance(one, dict))
    if base is tuple:
        item = next(iter(get_args(kind)), Any)
        return tuple(shaped(item, one) for one in value if fits(item, one))
    if base is int:
        return int(float(value))
    return base(value)


def text_of(raw: dict, *keys: str) -> str:
    for key in keys:
        value = raw.get(key)
        if value is None or value == "":
            continue
        return value if isinstance(value, str) else str(value)
    return ""


def number_of(raw: dict, *keys: str) -> float:
    for key in keys:
        value = raw.get(key)
        if value is None or value == "":
            continue
        return float(value)
    return 0.0


def whole_of(raw: dict, *keys: str) -> int:
    return int(number_of(raw, *keys))


def flag_of(raw: dict, key: str) -> bool:
    return bool(raw.get(key))


def mapping_of(raw: dict, key: str) -> dict:
    value = raw.get(key)
    return value if isinstance(value, dict) else {}


def list_of(raw: dict, key: str) -> list:
    value = raw.get(key)
    return value if isinstance(value, list) else []
