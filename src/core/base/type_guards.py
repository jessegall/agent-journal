from collections.abc import Mapping, MutableMapping
from typing import TypeIs


def is_list(value: object) -> TypeIs[list[object]]:
    return isinstance(value, list)


def is_tuple(value: object) -> TypeIs[tuple[object, ...]]:
    return isinstance(value, tuple)


def is_frozenset(value: object) -> TypeIs[frozenset[object]]:
    return isinstance(value, frozenset)


def is_set(value: object) -> TypeIs[set[object]]:
    return isinstance(value, set)


def is_mapping(value: object) -> TypeIs[Mapping[object, object]]:
    return isinstance(value, Mapping)


def is_text_mapping(value: object) -> TypeIs[Mapping[str, object]]:
    return is_mapping(value) and all(isinstance(key, str) for key in value)


def is_text_list(value: object) -> TypeIs[list[str]]:
    return is_list(value) and all(isinstance(item, str) for item in value)


def is_mutable_mapping(value: object) -> TypeIs[MutableMapping[object, object]]:
    return isinstance(value, MutableMapping)


def is_number(value: object) -> TypeIs[int | float]:
    return isinstance(value, (int, float)) and not isinstance(value, bool)


def is_object_mapping(value: object) -> TypeIs[Mapping[str, object]]:
    return isinstance(value, Mapping)
