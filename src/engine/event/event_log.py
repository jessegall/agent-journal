import json
from collections.abc import Sequence
from pathlib import Path
from dataclasses import fields

from engine.event.change import BOOKKEEPING_FIELDS, Change
from engine.event.logged_event import CREATION, LoggedEvent
from engine.database.bookkeeping_table import BookkeepingTable
from engine.database.database import Database
from engine.command.context import Context
from engine.row.page import Page
from engine.model.table import stored
from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model
from engine.model.tables import Tables

HIDDEN = "hidden"

PAGE_SIZE_EVENTS = 50
REGISTRY_SYNC_EVENT = "registry.sync"
JOURNAL_BOOTING_EVENT = "journal.booting"
FILE_PUBLISHING_EVENTS = f"{JOURNAL_BOOTING_EVENT}|{REGISTRY_SYNC_EVENT}"
JOURNAL_TABLE = "journal"
JOURNAL_ROW_ID = 0
BOOT_COMMAND = "journal start"
REGISTRY_TABLE = "registry"
REGISTRY_ROW_ID = 1
SYNC_COMMAND = "module sync"
UPGRADE_MOVED_EVENT = "upgrade.moved"
UPGRADE_COMMAND = "journal upgrade"
UPGRADE_TABLE = "version_four_moves"
UPGRADE_FINISHED_EVENT = "upgrade.finished"


class EventLog:
    """Writes every change to the event log, and the sync that changes the registry, and reads them back."""

    def __init__(self, database: Database, tables: Tables) -> None:
        self.tables = tables
        self.table = BookkeepingTable(database, "events", "event")

    def write(self, change: Change[Model], skipped_guards: frozenset[str]) -> int:
        context, row = change.context, change.row
        return self.table.insert({
            "actor_id": context.actor.id, "environment_id": row.environment_id if isinstance(row, EnvironmentScoped) else context.environment_id, "row_id": row.id, "name": change.event,
            "row_table": self.tables.table(type(change.row)).name, "command": context.command.label(), "cause_id": context.cause_id,
            "skipped_guards": json.dumps(sorted(skipped_guards)), "data": json.dumps(self.data(change)), "created_at": context.timestamp.text,
        })

    def write_registry_sync(self, actor_id: int, fingerprint: str, timestamp: str) -> int:
        return self.table.insert({
            "actor_id": actor_id, "environment_id": None, "row_id": REGISTRY_ROW_ID, "name": REGISTRY_SYNC_EVENT, "row_table": REGISTRY_TABLE,
            "command": SYNC_COMMAND, "cause_id": None, "skipped_guards": "[]", "data": json.dumps({"fingerprint": [None, fingerprint]}), "created_at": timestamp,
        })

    def write_file_change(self, name: str, path: Path, context: Context) -> int:
        return self.table.insert({
            "actor_id": context.actor.id, "environment_id": context.environment_id, "row_id": 0, "name": name, "row_table": "files",
            "command": context.command.label(), "cause_id": context.cause_id, "skipped_guards": json.dumps(sorted(context.skipped_guards)),
            "data": json.dumps({"path": [None, str(path)]}), "created_at": context.timestamp.text,
        })

    def write_journal_booting(self, actor_id: int, timestamp: str) -> int:
        return self.table.insert({
            "actor_id": actor_id, "environment_id": None, "row_id": JOURNAL_ROW_ID, "name": JOURNAL_BOOTING_EVENT, "row_table": JOURNAL_TABLE,
            "command": BOOT_COMMAND, "cause_id": None, "skipped_guards": "[]", "data": "{}", "created_at": timestamp,
        })

    def write_upgrade_moved(self, actor_id: int, module: str, counts: dict[str, dict[str, int]], timestamp: str) -> int:
        return self.table.insert({
            "actor_id": actor_id, "environment_id": None, "row_id": 0, "name": UPGRADE_MOVED_EVENT, "row_table": UPGRADE_TABLE,
            "command": UPGRADE_COMMAND, "cause_id": None, "skipped_guards": "[]", "data": json.dumps({"module": [None, module], "counts": [None, counts]}),
            "created_at": timestamp,
        })

    def write_upgrade_finished(self, actor_id: int, counts: dict[str, int], report: str, timestamp: str) -> int:
        return self.table.insert({
            "actor_id": actor_id, "environment_id": None, "row_id": 0, "name": UPGRADE_FINISHED_EVENT, "row_table": UPGRADE_TABLE,
            "command": UPGRADE_COMMAND, "cause_id": None, "skipped_guards": "[]", "data": json.dumps({"counts": [None, counts], "report": [None, report]}),
            "created_at": timestamp,
        })

    @staticmethod
    def row_values(row: Model) -> dict[str, object]:
        hidden = type(row).hidden_fields
        values = {field.name: HIDDEN if field.name in hidden else stored(getattr(row, field.name)) for field in fields(row) if field.name not in BOOKKEEPING_FIELDS}
        return {"id": row.id, **values}

    def data(self, change: Change[Model]) -> dict[str, list[object]]:
        names = change.fields if change.old_row and change.new_row else tuple(field.name for field in fields(change.row) if field.name not in BOOKKEEPING_FIELDS)
        hidden = type(change.row).hidden_fields
        data: dict[str, list[object]] = {name: [HIDDEN, HIDDEN] if name in hidden else [stored(getattr(change.old_row, name, None)), stored(getattr(change.new_row, name, None))]
                for name in names}
        if change.old_row is None and not change.event.endswith(CREATION):
            data["id"] = [None, change.row.id]
        return data

    def event(self, event_id: int) -> LoggedEvent:
        return LoggedEvent.parsed(self.table.row(event_id))

    def events_after(self, event_id: int, limit: int = PAGE_SIZE_EVENTS) -> list[LoggedEvent]:
        return [LoggedEvent.parsed(row) for row in self.table.rows_past(event_id, limit)]

    def latest_event(self, event: str) -> LoggedEvent | None:
        row = self.table.latest_event(event)
        return LoggedEvent.parsed(row) if row is not None else None

    def row_events(self, row_table: str, row_id: int) -> list[LoggedEvent]:
        return [LoggedEvent.parsed(row) for row in self.table.row_rows(row_table, row_id)]

    def latest_row(self, row_table: str, row_id: int, names: Sequence[str]) -> LoggedEvent | None:
        row = self.table.latest_row(row_table, row_id, names)
        return LoggedEvent.parsed(row) if row is not None else None

    def row_events_many(self, row_table: str, row_ids: Sequence[int]) -> list[LoggedEvent]:
        return [LoggedEvent.parsed(row) for row in self.table.row_rows_many(row_table, row_ids)]

    def child_events(self, event_id: int) -> list[LoggedEvent]:
        return [LoggedEvent.parsed(row) for row in self.table.child_rows(event_id)]

    def page(self, number: int, size: int) -> Page[LoggedEvent]:
        return self.table.newest_page(number, size, LoggedEvent.parsed)

    def newest_id(self) -> int:
        return self.table.newest_id()

    def prune(self, row_tables: Sequence[str], cutoff_at: str, limit: int) -> int:
        return self.table.delete_passed(row_tables, cutoff_at, limit)
