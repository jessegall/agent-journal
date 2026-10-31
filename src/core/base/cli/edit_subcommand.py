from argparse import ArgumentParser, Namespace
import dataclasses
from dataclasses import field
from typing import get_type_hints
from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.base.command.edit_command import EditCommand
from core.base.model.model import Model
from core.base.model.table import Table
from core.base.cli.subcommand_columns import generic_base, editable_columns, parser_argument


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


def edit_command(table: Table[Model]) -> type[EditCommand[Model]]:
    hints = get_type_hints(table.model)
    command_fields = [(column, hints[column] | None, field(default=None)) for column in editable_columns(table)]
    return dataclasses.make_dataclass(f"Edit{table.model.__name__}", command_fields, bases=tuple([generic_base(EditCommand[table.model])]), frozen=True)
