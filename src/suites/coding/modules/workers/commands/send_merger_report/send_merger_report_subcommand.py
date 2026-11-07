from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from suites.coding.modules.workers.commands.send_merger_report.send_merger_report import SendMergerReport


class SendMergerReportSubcommand(Subcommand[SendMergerReport, None]):
    """`journal merger tell "<words>"`: hands on to the main agent what it must act on."""

    cli_name = "merger"
    name = "tell"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("text")

    def command(self, arguments: Namespace, caller: Caller) -> SendMergerReport:
        return SendMergerReport(arguments.text)
