import json
from dataclasses import fields

from core.base.change.change import BOOKKEEPING_FIELDS, Change
from core.base.change.logged_event import LoggedEvent
from core.base.database.bookkeeping_table import BookkeepingTable
from core.base.database.database import Database
from core.base.page import Page
from core.base.model.table import stored
from core.base.model.model import Model
from core.base.model.tables import Tables

PAGE_SIZE_EVENTS = 100


class EventLog:
    """Writes every change to the event log and reads changes back from it."""

    def __init__(self, database: Database, tables: Tables) -> None:
        self.tables = tables
        self.table = BookkeepingTable(database, "events", "event")

    def write(self, change: Change[Model], skipped_guards: frozenset[str]) -> int:
        context = change.context
        return self.table.insert({
            "actor_id": context.actor.id, "environment_id": context.environment_id, "row_id": change.row.id, "name": change.event,
            "row_table": self.tables.table(type(change.row)).name, "command": context.command.label(), "cause_id": context.cause_id,
            "skipped_guards": json.dumps(sorted(skipped_guards)), "data": json.dumps(self.data(change)), "created_at": context.timestamp.text,
        })

    def data(self, change: Change[Model]) -> dict[str, list[object]]:
        names = change.fields if change.old_row and change.new_row else tuple(field.name for field in fields(change.row) if field.name not in BOOKKEEPING_FIELDS)
        return {name: [stored(getattr(change.old_row, name, None)), stored(getattr(change.new_row, name, None))] for name in names}

    def event(self, event_id: int) -> LoggedEvent:
        return LoggedEvent.parsed(self.table.row(event_id))

    def events_past(self, event_id: int, limit: int = PAGE_SIZE_EVENTS) -> list[LoggedEvent]:
        return [LoggedEvent.parsed(row) for row in self.table.rows_past(event_id, limit)]

    def page(self, number: int, size: int) -> Page[LoggedEvent]:
        return self.table.newest_page(number, size, LoggedEvent.parsed)

    def newest_id(self) -> int:
        return self.table.newest_id()
