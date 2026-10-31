from argparse import ArgumentParser, Namespace
from core.base.change.event_log import EventLog
from core.base.change.logged_event import LoggedEvent
from core.base.subcommand.caller import Caller
from core.base.subcommand.read_subcommand import ReadSubcommand


class EventShowSubcommand(ReadSubcommand[LoggedEvent]):
    """`journal event show <id>`: one logged change in full."""

    cli_name, name = "event", "show"

    def __init__(self, log: EventLog) -> None:
        self.log = log

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("id", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> LoggedEvent:
        return self.log.event(arguments.id)
