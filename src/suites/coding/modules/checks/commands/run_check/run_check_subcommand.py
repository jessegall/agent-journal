from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.command.bus import Bus
from engine.errors.refusal import Refusal
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from suites.coding.modules.checks.commands.record_check_run.record_check_run import RecordCheckRun
from suites.coding.modules.checks.commands.support.check_lines import CheckLines
from suites.coding.modules.checks.commands.support.check_progress import CheckProgress
from suites.coding.modules.checks.commands.support.check_runner import CheckRunner
from suites.coding.modules.checks.commands.support.kept_checks import KeptChecks
from suites.coding.modules.checks.models.check import Check


class RunCheckSubcommand(Subcommand[RecordCheckRun, Check]):
    """`journal check run <n>`: runs the check now, outside any transaction, says whether it passed and shows
    what it printed on a failure."""

    cli_name = "check"
    name = "run"
    outward = True

    def __init__(self, checks: KeptChecks, runner: CheckRunner, bus: Bus) -> None:
        self.checks, self.runner, self.bus = checks, runner, bus

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> RecordCheckRun:
        check = self.checks.find(arguments.id)
        if check.stopped:
            raise Refusal(f"check {check.id} is stopped", "a user starts it first, then it runs")
        outcome = self.runner.run(check.command, CheckProgress(self.bus, check.id).read_line)
        return RecordCheckRun(check.id, outcome.passed, outcome.output)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Check):
            output.line("\n".join(CheckLines.outcome_lines(value)))
