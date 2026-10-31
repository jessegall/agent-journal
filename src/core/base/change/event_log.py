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

HIDDEN = "hidden"

PAGE_SIZE_EVENTS = 100
REGISTRY_SYNC_EVENT = "registry.sync"
REGISTRY_TABLE = "registry"
REGISTRY_ROW_ID = 1
SYNC_COMMAND = "module sync"
UPGRADE_MOVED_EVENT = "upgrade.moved"
UPGRADE_COMMAND = "journal upgrade"
UPGRADE_TABLE = "version_four_moves"


class EventLog:
    """Writes every change to the event log, and the sync that changes the registry, and reads them back."""

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

    def write_registry_sync(self, actor_id: int, fingerprint: str, timestamp: str) -> int:
        return self.table.insert({
            "actor_id": actor_id, "environment_id": None, "row_id": REGISTRY_ROW_ID, "name": REGISTRY_SYNC_EVENT, "row_table": REGISTRY_TABLE,
            "command": SYNC_COMMAND, "cause_id": None, "skipped_guards": "[]", "data": json.dumps({"fingerprint": [None, fingerprint]}), "created_at": timestamp,
        })

    def write_upgrade_moved(self, actor_id: int, module: str, counts: dict[str, dict[str, int]], timestamp: str) -> int:
        return self.table.insert({
            "actor_id": actor_id, "environment_id": None, "row_id": 0, "name": UPGRADE_MOVED_EVENT, "row_table": UPGRADE_TABLE,
            "command": UPGRADE_COMMAND, "cause_id": None, "skipped_guards": "[]", "data": json.dumps({"module": [None, module], "counts": [None, counts]}),
            "created_at": timestamp,
        })

    def data(self, change: Change[Model]) -> dict[str, list[object]]:
        names = change.fields if change.old_row and change.new_row else tuple(field.name for field in fields(change.row) if field.name not in BOOKKEEPING_FIELDS)
        hidden = type(change.row).hidden_fields
        return {name: [HIDDEN, HIDDEN] if name in hidden else [stored(getattr(change.old_row, name, None)), stored(getattr(change.new_row, name, None))]
                for name in names}

    def event(self, event_id: int) -> LoggedEvent:
        return LoggedEvent.parsed(self.table.row(event_id))

    def events_past(self, event_id: int, limit: int = PAGE_SIZE_EVENTS) -> list[LoggedEvent]:
        return [LoggedEvent.parsed(row) for row in self.table.rows_past(event_id, limit)]

    def page(self, number: int, size: int) -> Page[LoggedEvent]:
        return self.table.newest_page(number, size, LoggedEvent.parsed)

    def newest_id(self) -> int:
        return self.table.newest_id()
