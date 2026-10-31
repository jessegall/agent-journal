from argparse import ArgumentParser
from dataclasses import MISSING, Field, field
from enum import StrEnum
from types import new_class
from typing import Any
from core.base.command.handlers.make_handler import CREATOR_COLUMN, ENVIRONMENT_COLUMN
from core.base.model.model import Model
from core.base.model.table import Table
from core.base.timestamp import Timestamp


FOREIGN_KEY_SUFFIX = "_id"


STATE_COLUMN = "state"


HANDLER_COLUMNS = (CREATOR_COLUMN, ENVIRONMENT_COLUMN)


def generic_base(base: object) -> type:
    return new_class(f"{base}Base", tuple([base]))


def editable_columns(table: Table[Model]) -> tuple[str, ...]:
    return tuple(column for column in (*argument_columns(table), *flag_columns(table)) if column != STATE_COLUMN)


def argument_columns(table: Table[Model]) -> tuple[str, ...]:
    return tuple(column for column in table.required_fields if column not in HANDLER_COLUMNS)


def flag_columns(table: Table[Model]) -> tuple[str, ...]:
    return tuple(column for column in table.optional_fields if column not in HANDLER_COLUMNS)


def copied_default(model_field: Field[Any]) -> Field[Any]:
    if model_field.default is not MISSING:
        return field(default=model_field.default)
    return field(default_factory=model_field.default_factory)


def parser_argument(parser: ArgumentParser, flag: str, value_type: type[object]) -> None:
    if value_type is bool:
        parser.add_argument(flag, action="store_true", default=None)
    elif issubclass(value_type, StrEnum):
        parser.add_argument(flag, type=value_type, choices=tuple(value_type.__members__.values()))
    elif value_type is Timestamp:
        parser.add_argument(flag, type=Timestamp.parsed)
    else:
        parser.add_argument(flag, type=value_type)
