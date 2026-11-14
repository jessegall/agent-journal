from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from suites.coding.modules.workers.commands.send_merge_findings.send_merge_findings import SendMergeFindings
from suites.coding.modules.workers.commands.merger.worker_text_arguments import worker_text_arguments


class SendMergeFindingsSubcommand(Subcommand[SendMergeFindings, None]):
    """`journal merger findings <worker> "<findings>"`: sends the judge's findings back to the worker."""

    cli_name = "merger"
    name = "findings"

    def arguments(self, parser: ArgumentParser) -> None:
        worker_text_arguments(parser, "findings")

    def command(self, arguments: Namespace, caller: Caller) -> SendMergeFindings:
        return SendMergeFindings(arguments.worker_id, arguments.findings)
