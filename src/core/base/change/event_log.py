import json
from dataclasses import fields

from core.base.change.change import UNCOMPARED_FIELDS, Change
from core.base.change.logged_event import LoggedEvent
from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.missing_rows import MissingRows
from core.base.model.table import stored
from core.base.model.model import Model
from core.base.model.tables import Tables

PAGE_SIZE_EVENTS = 100
INSERT = ("INSERT INTO events (actor_id, environment_id, row_id, name, row_table, command, cause_id, skipped_guards, data, created_at)"
          " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")


class EventLog:
    """Writes every change to the event log and reads changes back from it."""

    def __init__(self, database: Database, tables: Tables) -> None:
        self.database, self.tables = database, tables

    def write(self, change: Change[Model], skipped_guards: frozenset[str]) -> int:
        context = change.context
        parameters = (context.actor.id, context.environment_id, change.row.id, change.event, self.tables.table(type(change.row)).name,
                      context.command.label(), context.cause_id, json.dumps(sorted(skipped_guards)), json.dumps(self.data(change)), context.moment.text)
        return self.database.insert(Statement(INSERT, parameters))

    def data(self, change: Change[Model]) -> dict[str, list[object]]:
        names = change.fields if change.old_row and change.new_row else tuple(field.name for field in fields(change.row) if field.name not in UNCOMPARED_FIELDS)
        return {name: [stored(getattr(change.old_row, name, None)), stored(getattr(change.new_row, name, None))] for name in names}

    def event(self, event_id: int) -> LoggedEvent:
        rows = self.database.rows(Statement("SELECT * FROM events WHERE id = ?", (event_id,)))
        if not rows:
            raise MissingRows("event", (event_id,))
        return LoggedEvent.parsed(rows[0])

    def events_past(self, event_id: int, limit: int = PAGE_SIZE_EVENTS) -> list[LoggedEvent]:
        return [LoggedEvent.parsed(row) for row in self.database.rows(Statement("SELECT * FROM events WHERE id > ? ORDER BY id LIMIT ?", (event_id, limit)))]

    def newest_id(self) -> int:
        return self.database.rows(Statement("SELECT coalesce(max(id), 0) FROM events"))[0][0]
