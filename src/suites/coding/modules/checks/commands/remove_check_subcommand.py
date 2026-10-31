from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from suites.coding.modules.checks.commands.remove_check import RemoveCheck
from suites.coding.modules.checks.models.check import Check


class RemoveCheckSubcommand(Subcommand[RemoveCheck, Check]):
    """`journal check remove <n>`: the check runs no more and leaves the list."""

    cli_name = "check"
    name = "remove"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> RemoveCheck:
        return RemoveCheck(arguments.id)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Check):
            output.line(f"check {value.id} removed: it runs no more")
