import sqlite3
from dataclasses import MISSING, fields
from types import NoneType, UnionType
from enum import StrEnum
from typing import Any, Union, get_args, get_origin, get_type_hints

from core.base.metadata import Metadata
from core.base.model.model import Model
from core.base.moment import Moment

BASE_FIELDS = ("id", "version", "metadata", "created_at", "updated_at")
UNSTORED_FIELDS = ("move",)
VOWELS = "aeiou"


class Table:
    """How a model maps to its database table and columns."""

    def __init__(self, model: type[Model], name: str, types: dict[str, type]) -> None:
        self.model, self.name, self.types = model, name, types
        self.noun = model.cli_noun

    @classmethod
    def build(cls, model: type[Model]) -> "Table":
        hints = get_type_hints(model)
        column_types = {field.name: plain_type(hints[field.name]) for field in fields(model) if field.name not in UNSTORED_FIELDS}
        return cls(model, getattr(model, "table", plural(model.name)), column_types)

    @property
    def columns(self) -> tuple[str, ...]:
        return tuple(self.types)

    @property
    def required_fields(self) -> tuple[str, ...]:
        return tuple(field.name for field in fields(self.model) if self.is_model_field(field.name) and field.default is MISSING and field.default_factory is MISSING)

    @property
    def optional_fields(self) -> tuple[str, ...]:
        return tuple(field.name for field in fields(self.model) if self.is_model_field(field.name) and field.name not in self.required_fields)

    def is_model_field(self, name: str) -> bool:
        return name in self.types and name not in BASE_FIELDS

    def has_column(self, column: str) -> bool:
        return column in self.types

    def row(self, model: Model, columns: tuple[str, ...]) -> dict[str, object]:
        return {column: stored(getattr(model, column)) for column in columns}

    def row_model(self, row: sqlite3.Row) -> Model:
        return self.model(**{column: loaded(self.types[column], row[column]) for column in self.columns})


def plural(name: str) -> str:
    if name.endswith("y") and name[-2:-1] not in VOWELS:
        return name[:-1] + "ies"
    return name + ("es" if name.endswith(("s", "x", "sh", "ch")) else "s")


class UnstorableType(Exception):
    """Raised when a model has a field whose type cannot be stored in the database."""


def plain_type(hint: object) -> type:
    if get_origin(hint) in (Union, UnionType):
        hint = next(arg for arg in get_args(hint) if arg is not NoneType)
    if isinstance(hint, type):
        return hint
    raise UnstorableType(f"a field typed {hint} cannot be stored")


def stored(value: object) -> object:
    if isinstance(value, Moment):
        return value.text
    if isinstance(value, Metadata):
        return value.text
    if isinstance(value, StrEnum):
        return value.value
    if isinstance(value, bool):
        return int(value)
    return value


def loaded(kind: type, value: object) -> Any:
    if value is None:
        return None
    if kind is Moment and isinstance(value, str):
        return Moment.parsed(value)
    if kind is Metadata and isinstance(value, str):
        return Metadata.parsed(value)
    if issubclass(kind, StrEnum) and isinstance(value, str):
        return kind(value)
    if kind is bool:
        return bool(value)
    return value
