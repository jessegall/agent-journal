from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.cli.agent_number import AgentNumber
from engine.subcommand.subcommand import Subcommand
from core.modules.helpers.commands.send_kept_report.send_kept_report import SendKeptReport


class SendKeptReportSubcommand(Subcommand[SendKeptReport, str]):
    """`journal helper report-retry <n>`: saves a helper's kept report again."""

    cli_name = "helper"
    name = "report-retry"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("helper_id", type=AgentNumber)

    def command(self, arguments: Namespace, caller: Caller) -> SendKeptReport:
        return SendKeptReport(arguments.helper_id)
