from collections.abc import Sequence
from argparse import ArgumentParser, Namespace
import dataclasses
from dataclasses import MISSING, Field, field, fields
from enum import StrEnum
from types import new_class
from typing import Any, TypeIs, get_type_hints

from core.base.subcommand.caller import Caller
from core.base.subcommand.subcommand import ReadSubcommand, Subcommand
from core.base.command.delete_command import DeleteCommand
from core.base.command.edit_command import EditCommand
from core.base.command.handlers.make_handler import CREATOR_COLUMN, ENVIRONMENT_COLUMN
from core.base.command.make_command import MakeCommand
from core.base.command.move_command import ROW_ID, MoveCommand
from core.base.subcommand.output import Output
from core.base.model.model import Model
from core.base.model.move import Move
from core.base.model.table import Table, plain_type
from core.base.registry.dotted_path import DottedPath
from core.base.model.tables import Tables
from core.base.timestamp import Timestamp
from core.base.page import Page
from core.base.query.queries import Queries
from core.base.query.query import PAGE_SIZE_ROWS

FOREIGN_KEY_SUFFIX = "_id"
STATE_COLUMN = "state"
HANDLER_COLUMNS = (CREATOR_COLUMN, ENVIRONMENT_COLUMN)


class MakeSubcommand(Subcommand[MakeCommand[Model], Model]):
    """The `make` subcommand the core builds for a model: the model's required fields as arguments, its optional
    fields as flags, run as a make command of that model."""

    name = "make"

    def __init__(self, table: Table[Model]) -> None:
        self.table = table
        self.cli_name = table.model.cli_name
        self.command_class = creation_command(table)

    def arguments(self, parser: ArgumentParser) -> None:
        for column in argument_columns(self.table):
            parser_argument(parser, column, self.table.types[column])
        for column in flag_columns(self.table):
            parser_argument(parser, f"--{column.replace('_', '-')}", self.table.types[column])

    def command(self, arguments: Namespace, caller: Caller) -> MakeCommand[Model]:
        columns = (*argument_columns(self.table), *flag_columns(self.table))
        values = {column: getattr(arguments, column) for column in columns if getattr(arguments, column) is not None}
        return self.command_class(**values)


class ShowSubcommand(ReadSubcommand[Model]):
    """The `show <id>` subcommand the core builds for a model: one row in full."""

    name = "show"

    def __init__(self, table: Table[Model], queries: Queries) -> None:
        self.table, self.queries = table, queries
        self.cli_name = table.model.cli_name

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("id", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> Model:
        return self.queries.query(self.table.model).find(arguments.id)


class ListSubcommand(ReadSubcommand[Page[Model]]):
    """The `list` subcommand the core builds for a model: rows newest first, a page at a time, with a filter flag
    for each enum column and each foreign key, named without its _id."""

    name = "list"

    def __init__(self, table: Table[Model], queries: Queries) -> None:
        self.table, self.queries = table, queries
        self.cli_name = table.model.cli_name

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--page", type=int, default=1)
        parser.add_argument("--limit", type=int, default=PAGE_SIZE_ROWS)
        parser.add_argument("--oldest", action="store_true")
        for column in self.filter_columns():
            parser_argument(parser, f"--{filter_flag(column)}", self.table.types[column])

    def read(self, arguments: Namespace, caller: Caller) -> Page[Model]:
        values = {column: getattr(arguments, filter_flag(column).replace("-", "_")) for column in self.filter_columns()}
        query = self.queries.query(self.table.model).filter(**{column: value for column, value in values.items() if value is not None})
        return (query.oldest() if arguments.oldest else query.newest()).page(arguments.page, arguments.limit)

    def filter_columns(self) -> tuple[str, ...]:
        return tuple(column for column, value_type in self.table.types.items()
                     if column != "id" and (issubclass(value_type, StrEnum) or (column.endswith(FOREIGN_KEY_SUFFIX) and value_type is int)))


class EditSubcommand(Subcommand[EditCommand[Model], Model]):
    """The `edit <id>` subcommand the core builds for a model: a flag for each field but the state, and only the
    fields named are changed."""

    name = "edit"

    def __init__(self, table: Table[Model]) -> None:
        self.table = table
        self.cli_name = table.model.cli_name
        self.command_class = edit_command(table)

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("row_id", type=int)
        for column in editable_columns(self.table):
            parser_argument(parser, f"--{column.replace('_', '-')}", self.table.types[column])

    def command(self, arguments: Namespace, caller: Caller) -> EditCommand[Model]:
        values = {column: getattr(arguments, column) for column in editable_columns(self.table) if getattr(arguments, column) is not None}
        return self.command_class(row_id=arguments.row_id, **values)


class DeleteSubcommand(Subcommand[DeleteCommand, None]):
    """The `delete <id>` subcommand the core builds for a model, refused while other rows refer to the row."""

    name = "delete"

    def __init__(self, table: Table[Model]) -> None:
        self.table = table
        self.cli_name = table.model.cli_name
        self.command_class = deletion_command(table)

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("row_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> DeleteCommand:
        return self.command_class(row_id=arguments.row_id)

    def write_output(self, value: object, output: Output) -> None:
        output.line(f"the {self.cli_name} is deleted")


class MoveSubcommand(Subcommand[MoveCommand[Model], Model]):
    """The subcommand the core builds for one move of a model's lifecycle, named for the move: the row's id, and
    a flag for each field of the move's typed command, if the module gives one."""

    def __init__(self, table: Table[Model], command_class: type[MoveCommand[Model]]) -> None:
        self.table, self.command_class = table, command_class
        self.cli_name = table.model.cli_name
        self.name = command_class.move.name.replace("_", "-")

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("row_id", type=int)
        hints = get_type_hints(self.command_class)
        for command_field in self.command_fields():
            flag = f"--{command_field.name.replace('_', '-')}"
            if command_field.default is MISSING and command_field.default_factory is MISSING:
                parser.add_argument(flag, type=plain_type(hints[command_field.name]), required=True)
            else:
                parser_argument(parser, flag, plain_type(hints[command_field.name]))

    def command(self, arguments: Namespace, caller: Caller) -> MoveCommand[Model]:
        values = {command_field.name: getattr(arguments, command_field.name) for command_field in self.command_fields()
                  if getattr(arguments, command_field.name) is not None}
        return self.command_class(row_id=arguments.row_id, **values)

    def command_fields(self) -> tuple[Field[Any], ...]:
        return tuple(command_field for command_field in fields(self.command_class) if command_field.name != ROW_ID)


class DefaultSubcommands:
    """Builds the subcommands every model gets from its model, so a module writes only the ones that differ."""

    def __init__(self, tables: Tables, queries: Queries) -> None:
        self.tables, self.queries = tables, queries

    def make(self, model: type[Model]) -> MakeSubcommand:
        return MakeSubcommand(self.tables.table(model))

    def show(self, model: type[Model]) -> ShowSubcommand:
        return ShowSubcommand(self.tables.table(model), self.queries)

    def list(self, model: type[Model]) -> ListSubcommand:
        return ListSubcommand(self.tables.table(model), self.queries)

    def edit(self, model: type[Model]) -> EditSubcommand:
        return EditSubcommand(self.tables.table(model))

    def delete(self, model: type[Model]) -> DeleteSubcommand:
        return DeleteSubcommand(self.tables.table(model))

    def moves(self, model: type[Model], command_paths: Sequence[str]) -> tuple[MoveSubcommand, ...]:
        lifecycle = model.lifecycle
        if lifecycle is None:
            return ()
        command_index = {command.move.name: command for command in model_move_commands(command_paths)}
        table = self.tables.table(model)
        return tuple(MoveSubcommand(table, command_index.get(move.name) or move_command(table, move)) for move in lifecycle.moves())


def filter_flag(column: str) -> str:
    return column.removesuffix(FOREIGN_KEY_SUFFIX).replace("_", "-")


def creation_command(table: Table[Model]) -> type[MakeCommand[Model]]:
    hints = get_type_hints(table.model)
    model_fields = {model_field.name: model_field for model_field in fields(table.model)}
    command_fields = [(column, hints[column]) for column in argument_columns(table)]
    command_fields += [(column, hints[column], copied_default(model_fields[column])) for column in flag_columns(table)]
    return dataclasses.make_dataclass(f"{table.model.__name__}Make", command_fields, bases=tuple([generic_base(MakeCommand[table.model])]), frozen=True)


def edit_command(table: Table[Model]) -> type[EditCommand[Model]]:
    hints = get_type_hints(table.model)
    command_fields = [(column, hints[column] | None, field(default=None)) for column in editable_columns(table)]
    return dataclasses.make_dataclass(f"{table.model.__name__}Edit", command_fields, bases=tuple([generic_base(EditCommand[table.model])]), frozen=True)


def deletion_command(table: Table[Model]) -> type[DeleteCommand]:
    return dataclasses.make_dataclass(f"{table.model.__name__}Delete", [], bases=tuple([DeleteCommand]), namespace={"deleted_model": table.model}, frozen=True)


def move_command(table: Table[Model], move: Move) -> type[MoveCommand[Model]]:
    class_name = f"{table.model.__name__}{move.name.title().replace('_', '')}"
    return dataclasses.make_dataclass(class_name, [], bases=tuple([generic_base(MoveCommand[table.model])]), namespace={"move": move}, frozen=True)


def model_move_commands(command_paths: Sequence[str]) -> tuple[type[MoveCommand[Model]], ...]:
    loaded = tuple(DottedPath(path).loaded() for path in command_paths)
    return tuple(command for command in loaded if is_move_command(command))


def is_move_command(class_type: type) -> TypeIs[type[MoveCommand[Model]]]:
    return issubclass(class_type, MoveCommand)


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
