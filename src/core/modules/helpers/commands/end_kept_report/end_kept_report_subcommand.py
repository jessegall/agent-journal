from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.cli.agent_number import AgentNumber
from engine.subcommand.subcommand import Subcommand
from core.modules.helpers.commands.end_kept_report.end_kept_report import EndKeptReport


class EndKeptReportSubcommand(Subcommand[EndKeptReport, str]):
    """`journal helper report-drop <n>`: ends a helper's job whose report could not be saved."""

    cli_name = "helper"
    name = "report-drop"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("helper_id", type=AgentNumber)

    def command(self, arguments: Namespace, caller: Caller) -> EndKeptReport:
        return EndKeptReport(arguments.helper_id)
