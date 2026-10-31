from argparse import ArgumentParser, Namespace
from core.base.subcommand.caller import Caller
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.refusal_log import RefusalLog
from core.base.recorded_refusal import RecordedRefusal


class RefusalShowSubcommand(ReadSubcommand[RecordedRefusal]):
    """`journal refusal show <id>`: one recorded refusal."""

    cli_name, name = "refusal", "show"

    def __init__(self, refusals: RefusalLog) -> None:
        self.refusals = refusals

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("id", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> RecordedRefusal:
        return self.refusals.refusal(arguments.id)
