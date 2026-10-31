from argparse import ArgumentParser, Namespace
from dataclasses import MISSING, Field, fields
from typing import Any, get_type_hints
from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.base.command.move_command import ROW_ID, MoveCommand
from core.base.model.model import Model
from core.base.model.table import Table, plain_type
from core.base.cli.subcommand_columns import parser_argument


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
