from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from suites.coding.modules.checks.commands.stop_check import StopCheck
from suites.coding.modules.checks.models.check import Check


class StopCheckSubcommand(Subcommand[StopCheck, Check]):
    """`journal check stop <n>`: the check runs no more until a person starts it again."""

    cli_name = "check"
    name = "stop"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> StopCheck:
        return StopCheck(arguments.id)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Check):
            output.line(f"check {value.id} stopped: it runs no more")
