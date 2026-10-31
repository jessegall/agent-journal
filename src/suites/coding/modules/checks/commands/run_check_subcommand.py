from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from suites.coding.modules.checks.commands.run_check import RunCheck
from suites.coding.modules.checks.commands.support.check_lines import CheckLines
from suites.coding.modules.checks.models.check import Check


class RunCheckSubcommand(Subcommand[RunCheck, Check]):
    """`journal check run <n>`: runs the check now, says whether it passed and shows what it printed on a failure."""

    cli_name = "check"
    name = "run"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> RunCheck:
        return RunCheck(arguments.id)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Check):
            output.line("\n".join(CheckLines.outcome_lines(value)))
