from dataclasses import fields
from functools import cache
from types import UnionType
from typing import Any, ClassVar, Union, get_args, get_origin, get_type_hints

SKIPPED = object()


class Loaded:
    aliases: ClassVar[dict] = {}
    keyed_by: ClassVar[str] = ""

    @classmethod
    def from_json(cls, raw):
        given = {}
        for name, keys, convert in plan(cls) if isinstance(raw, dict) else ():
            value = found(raw, keys, convert)
            if value is not SKIPPED:
                given[name] = value
        return cls(**given)


def found(raw: dict, keys: tuple, convert):
    for key in keys:
        value = raw.get(key)
        if value is not None and value != "":
            return convert(value)
    return SKIPPED


@cache
def plan(cls) -> tuple:
    hints = get_type_hints(cls)
    return tuple((field.name, cls.aliases.get(field.name, (field.name,)), converter(hints[field.name])) for field in fields(cls) if field.init)


@cache
def converter(kind):
    if get_origin(kind) in (Union, UnionType):
        return converter(next(arg for arg in get_args(kind) if arg is not type(None)))
    base = get_origin(kind) or kind
    if base in (Any, object):
        return lambda value: value
    if isinstance(base, type) and issubclass(base, Loaded):
        return lambda value: base.from_json(value) if isinstance(value, dict) and value else SKIPPED
    if base is tuple:
        return items(next(iter(get_args(kind)), Any))
    if base in (dict, list):
        return lambda value: base(value) if isinstance(value, (dict,) if base is dict else (list, tuple)) and value else SKIPPED
    if base is str:
        return lambda value: value if isinstance(value, str) else str(value)
    if base is int:
        return lambda value: value if type(value) is int else int(float(value))
    return base


def items(kind):
    if isinstance(kind, type) and issubclass(kind, Loaded) and kind.keyed_by:
        return lambda value: tuple(kind.from_json({**one, kind.keyed_by: key}) for key, one in value.items() if isinstance(one, dict)) \
            if isinstance(value, dict) and value else SKIPPED
    one = converter(kind)
    return lambda value: tuple(item for item in map(one, value) if item is not SKIPPED) if isinstance(value, (list, tuple)) and value else SKIPPED
