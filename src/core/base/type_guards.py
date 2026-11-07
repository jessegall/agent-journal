from collections.abc import Mapping
from typing import TypeIs


def is_list(value: object) -> TypeIs[list[object]]:
    return isinstance(value, list)


def is_tuple(value: object) -> TypeIs[tuple[object, ...]]:
    return isinstance(value, tuple)


def is_frozenset(value: object) -> TypeIs[frozenset[object]]:
    return isinstance(value, frozenset)


def is_mapping(value: object) -> TypeIs[Mapping[object, object]]:
    return isinstance(value, Mapping)


def is_text_list(value: object) -> TypeIs[list[str]]:
    return is_list(value) and all(isinstance(item, str) for item in value)
