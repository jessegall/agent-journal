from argparse import ArgumentParser, Namespace
from engine.change.event_log import EventLog
from engine.change.logged_event import LoggedEvent
from engine.caller.caller import Caller
from engine.subcommand.read_subcommand import ReadSubcommand


class EventShowSubcommand(ReadSubcommand[LoggedEvent]):
    """`journal event show <id>`: one logged change in full."""

    cli_name, name = "event", "show"

    def __init__(self, log: EventLog) -> None:
        self.log = log

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("id", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> LoggedEvent:
        return self.log.event(arguments.id)
