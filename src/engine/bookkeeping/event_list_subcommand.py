from argparse import ArgumentParser, Namespace
from engine.event.event_log import EventLog
from engine.event.logged_event import LoggedEvent
from engine.caller.caller import Caller
from engine.subcommand.read_subcommand import ReadSubcommand
from engine.row.page import Page
from engine.subcommand.page_arguments import page_arguments


class EventListSubcommand(ReadSubcommand[Page[LoggedEvent]]):
    """`journal event list`: the logged changes, newest first, a page at a time."""

    cli_name, name = "event", "list"

    def __init__(self, log: EventLog) -> None:
        self.log = log

    def arguments(self, parser: ArgumentParser) -> None:
        page_arguments(parser)

    def read(self, arguments: Namespace, caller: Caller) -> Page[LoggedEvent]:
        return self.log.page(arguments.page, arguments.limit)
