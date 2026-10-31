from argparse import ArgumentParser, Namespace

from core.base.change.event_log import EventLog
from core.base.change.logged_event import LoggedEvent
from core.base.subcommand.caller import Caller
from core.base.subcommand.subcommand import ReadSubcommand
from core.base.page import Page
from core.base.query.query import PAGE_SIZE_ROWS
from core.base.refusal_log import RecordedRefusal, RefusalLog


def page_arguments(parser: ArgumentParser) -> None:
    parser.add_argument("--page", type=int, default=1)
    parser.add_argument("--limit", type=int, default=PAGE_SIZE_ROWS)


class EventShowSubcommand(ReadSubcommand[LoggedEvent]):
    """`journal event show <id>`: one logged change in full."""

    cli_name, name = "event", "show"

    def __init__(self, log: EventLog) -> None:
        self.log = log

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("id", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> LoggedEvent:
        return self.log.event(arguments.id)


class EventListSubcommand(ReadSubcommand[Page[LoggedEvent]]):
    """`journal event list`: the logged changes, newest first, a page at a time."""

    cli_name, name = "event", "list"

    def __init__(self, log: EventLog) -> None:
        self.log = log

    def arguments(self, parser: ArgumentParser) -> None:
        page_arguments(parser)

    def read(self, arguments: Namespace, caller: Caller) -> Page[LoggedEvent]:
        return self.log.page(arguments.page, arguments.limit)


class RefusalShowSubcommand(ReadSubcommand[RecordedRefusal]):
    """`journal refusal show <id>`: one recorded refusal."""

    cli_name, name = "refusal", "show"

    def __init__(self, refusals: RefusalLog) -> None:
        self.refusals = refusals

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("id", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> RecordedRefusal:
        return self.refusals.refusal(arguments.id)


class RefusalListSubcommand(ReadSubcommand[Page[RecordedRefusal]]):
    """`journal refusal list`: the recorded refusals, newest first, a page at a time."""

    cli_name, name = "refusal", "list"

    def __init__(self, refusals: RefusalLog) -> None:
        self.refusals = refusals

    def arguments(self, parser: ArgumentParser) -> None:
        page_arguments(parser)

    def read(self, arguments: Namespace, caller: Caller) -> Page[RecordedRefusal]:
        return self.refusals.page(arguments.page, arguments.limit)


BOOKKEEPING_SUBCOMMANDS: dict[str, type[ReadSubcommand[object]]] = {
    f"{subcommand.cli_name} {subcommand.name}": subcommand
    for subcommand in (EventShowSubcommand, EventListSubcommand, RefusalShowSubcommand, RefusalListSubcommand)
}
