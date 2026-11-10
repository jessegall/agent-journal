from collections.abc import Sequence
import json
import sqlite3
from collections.abc import Mapping
from dataclasses import MISSING, fields
from types import NoneType, UnionType
from enum import StrEnum
from functools import cached_property
from typing import Any, Generic, TypeVar, Union, get_args, get_origin, get_type_hints
from engine.row.metadata import Metadata
from engine.model.added_state import AddedState
from engine.model.model import Model, STATE
from engine.model.view_model import ViewModel
from engine.time.timestamp import Timestamp
from engine.model.unsupported_column_type_error import UnsupportedColumnTypeError

R = TypeVar("R", bound=Model | ViewModel, covariant=True)
T = TypeVar("T", bound=Model | ViewModel)
BASE_FIELDS = ("id", "version", "metadata", "created_at", "updated_at")
TRANSIENT_FIELDS = ["move"]
VOWELS = "aeiou"


class Table(Generic[R]):
    """How a model or a view model maps to its table or view, its columns and its key column."""

    def __init__(self, model: type[R], name: str, types: dict[str, type], key: str) -> None:
        self.model, self.name, self.types, self.key = model, name, types, key
        self.cli_name = model.cli_name

    @classmethod
    def build(cls, model: type[T]) -> "Table[T]":
        hints = get_type_hints(model)
        column_types = {field.name: plain_type(hints[field.name]) for field in fields(model) if field.name not in TRANSIENT_FIELDS}
        if issubclass(model, ViewModel):
            return Table(model, model.view, column_types, model.key)
        return Table(model, getattr(model, "table", plural(model.model_name)), column_types, "id")

    @property
    def columns(self) -> tuple[str, ...]:
        return tuple(self.types)

    @property
    def required_fields(self) -> list[str]:
        return [field.name for field in fields(self.model) if self.is_model_field(field.name) and field.default is MISSING and field.default_factory is MISSING]

    @property
    def optional_fields(self) -> tuple[str, ...]:
        return tuple(field.name for field in fields(self.model) if self.is_model_field(field.name) and field.name not in self.required_fields)

    def is_model_field(self, name: str) -> bool:
        return name in self.types and name not in BASE_FIELDS

    def has_column(self, column: str) -> bool:
        return column in self.types

    @cached_property
    def nullable_columns(self) -> frozenset[str]:
        hints = get_type_hints(self.model)
        return frozenset(column for column in self.columns if NoneType in get_args(hints[column]))

    def has_nullable_column(self, column: str) -> bool:
        return column in self.nullable_columns

    def row(self, model: Model, columns: Sequence[str]) -> dict[str, object]:
        return {column: stored(getattr(model, column)) for column in columns}

    def new_model(self, values: Mapping[str, Any]) -> R:
        unknown = [name for name in values if not self.has_column(name)]
        if unknown:
            raise UnsupportedColumnTypeError(f"{self.model.__name__} has no field {', '.join(unknown)}")
        return self.model(**values)

    def row_model(self, row: sqlite3.Row) -> R:
        return self.model(**{column: self.loaded_column(column, row[column]) for column in self.columns})

    def loaded_column(self, column: str, value: object) -> Any:
        return loaded_state(self.types[column], value) if column == STATE else loaded(self.types[column], value)


def plural(name: str) -> str:
    if name.endswith("y") and name[-2:-1] not in VOWELS:
        return name[:-1] + "ies"
    return name + ("es" if name.endswith(("s", "x", "sh", "ch")) else "s")


def indefinite_article(cli_name: str) -> str:
    return "an" if cli_name[:1].lower() in "aeiou" else "a"


def plain_type(hint: object) -> type:
    if get_origin(hint) in (Union, UnionType):
        hint = next(arg for arg in get_args(hint) if arg is not NoneType)
    if get_origin(hint) is tuple:
        return tuple
    if isinstance(hint, type):
        return hint
    raise UnsupportedColumnTypeError(f"a field typed {hint} cannot be stored")


def stored(value: object) -> object:
    if isinstance(value, Timestamp):
        return value.text
    if isinstance(value, Metadata):
        return value.text
    if isinstance(value, StrEnum):
        return value.value
    if isinstance(value, bool):
        return int(value)
    if isinstance(value, (tuple, list)):
        return json.dumps(value)
    return value


def loaded_state(value_type: type, value: object) -> object:
    if isinstance(value, str) and issubclass(value_type, StrEnum):
        return value_type(value) if value in value_type._value2member_map_ else AddedState(value)
    return loaded(value_type, value)


def loaded(value_type: type, value: object) -> Any:
    if value is None:
        return None
    if value_type is Timestamp and isinstance(value, str):
        return Timestamp.parsed(value)
    if value_type is Metadata and isinstance(value, str):
        return Metadata.parsed(value)
    if issubclass(value_type, StrEnum) and isinstance(value, str):
        return value_type(value)
    if value_type is bool:
        return bool(value)
    if value_type is not int and issubclass(value_type, int) and isinstance(value, int):
        return value_type(value)
    if value_type is tuple and isinstance(value, str):
        return tuple(json.loads(value))
    return value
