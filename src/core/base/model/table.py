import sqlite3
import types
from dataclasses import MISSING, Field, fields
from enum import StrEnum
from typing import Union, get_args, get_origin, get_type_hints

from core.base.metadata import Metadata
from core.base.model.model import Model
from core.base.moment import Moment

BASE_FIELDS = ("id", "version", "metadata", "created_at", "updated_at")
UNSTORED_FIELDS = ("move",)
VOWELS = "aeiou"


class Table:
    """How a model is stored: each field one column of the same name, converted by its type, in the table named
    for the model."""

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
    def model_fields(self) -> tuple[Field, ...]:
        return tuple(field for field in fields(self.model) if field.name in self.types and field.name not in BASE_FIELDS)

    @property
    def required_fields(self) -> tuple[str, ...]:
        return tuple(field.name for field in self.model_fields if field.default is MISSING and field.default_factory is MISSING)

    @property
    def optional_fields(self) -> tuple[str, ...]:
        return tuple(field.name for field in self.model_fields if field.name not in self.required_fields)

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


def plain_type(hint: object) -> type:
    if get_origin(hint) in (Union, types.UnionType):
        return next(arg for arg in get_args(hint) if arg is not type(None))
    return hint


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


def loaded(kind: type, value: object) -> object:
    if value is None:
        return None
    if kind is Moment:
        return Moment.parsed(value)
    if kind is Metadata:
        return Metadata.parsed(value)
    if isinstance(kind, type) and issubclass(kind, StrEnum):
        return kind(value)
    if kind is bool:
        return bool(value)
    return value
