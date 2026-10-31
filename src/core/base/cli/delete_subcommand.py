from argparse import ArgumentParser, Namespace
import dataclasses
from core.base.subcommand.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.base.command.delete_command import DeleteCommand
from core.base.subcommand.output import Output
from core.base.model.model import Model
from core.base.model.table import Table


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


def deletion_command(table: Table[Model]) -> type[DeleteCommand]:
    return dataclasses.make_dataclass(f"Delete{table.model.__name__}", [], bases=tuple([DeleteCommand]), namespace={"deleted_model": table.model}, frozen=True)
