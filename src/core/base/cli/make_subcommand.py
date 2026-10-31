from argparse import ArgumentParser, Namespace
import dataclasses
from dataclasses import field, fields
from typing import get_type_hints
from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.base.command.make_command import MakeCommand
from core.base.model.model import Model
from core.base.model.table import Table
from core.base.cli.subcommand_columns import generic_base, argument_columns, flag_columns, switch_columns, copied_default, parser_argument


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


def creation_command(table: Table[Model]) -> type[MakeCommand[Model]]:
    hints = get_type_hints(table.model)
    model_fields = {model_field.name: model_field for model_field in fields(table.model)}
    command_fields = [(column, hints[column]) for column in argument_columns(table)]
    command_fields += [(column, hints[column], field(default=False) if column in switch_columns(table) else copied_default(model_fields[column]))
                       for column in flag_columns(table)]
    return dataclasses.make_dataclass(f"Make{table.model.__name__}", command_fields, bases=tuple([generic_base(MakeCommand[table.model])]), frozen=True)
