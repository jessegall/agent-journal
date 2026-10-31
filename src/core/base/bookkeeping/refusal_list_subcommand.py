from argparse import ArgumentParser, Namespace
from core.base.caller.caller import Caller
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.page import Page
from core.base.refusal_log import RefusalLog
from core.base.recorded_refusal import RecordedRefusal
from core.base.subcommand.page_arguments import page_arguments


class RefusalListSubcommand(ReadSubcommand[Page[RecordedRefusal]]):
    """`journal refusal list`: the recorded refusals, newest first, a page at a time."""

    cli_name, name = "refusal", "list"

    def __init__(self, refusals: RefusalLog) -> None:
        self.refusals = refusals

    def arguments(self, parser: ArgumentParser) -> None:
        page_arguments(parser)

    def read(self, arguments: Namespace, caller: Caller) -> Page[RecordedRefusal]:
        return self.refusals.page(arguments.page, arguments.limit)
