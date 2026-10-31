from argparse import ArgumentParser, Namespace
from core.base.change.event_log import EventLog
from core.base.change.logged_event import LoggedEvent
from core.base.subcommand.caller import Caller
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.page import Page
from core.base.cli.page_arguments import page_arguments


class EventListSubcommand(ReadSubcommand[Page[LoggedEvent]]):
    """`journal event list`: the logged changes, newest first, a page at a time."""

    cli_name, name = "event", "list"

    def __init__(self, log: EventLog) -> None:
        self.log = log

    def arguments(self, parser: ArgumentParser) -> None:
        page_arguments(parser)

    def read(self, arguments: Namespace, caller: Caller) -> Page[LoggedEvent]:
        return self.log.page(arguments.page, arguments.limit)
