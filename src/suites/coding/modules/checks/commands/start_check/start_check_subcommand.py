from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from suites.coding.modules.checks.commands.start_check.start_check import StartCheck
from suites.coding.modules.checks.models.check import Check


class StartCheckSubcommand(Subcommand[StartCheck, Check]):
    """`journal check start <n>`: a person starts a stopped check, which runs again on its next due round."""

    cli_name = "check"
    name = "start"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> StartCheck:
        return StartCheck(arguments.id)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Check):
            output.line(f"check {value.id} started: it runs again")
