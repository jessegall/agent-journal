from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.cli.agent_number import AgentNumber
from engine.subcommand.subcommand import Subcommand
from core.modules.helpers.commands.retry_kept_report.retry_kept_report import RetryKeptReport


class RetryKeptReportSubcommand(Subcommand[RetryKeptReport, str]):
    """`journal unsaved-report retry <n>`: saves a helper's kept report again."""

    cli_name = "unsaved-report"
    name = "retry"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("helper_id", type=AgentNumber)

    def command(self, arguments: Namespace, caller: Caller) -> RetryKeptReport:
        return RetryKeptReport(arguments.helper_id)
