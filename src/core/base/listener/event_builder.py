from dataclasses import replace
from collections.abc import Sequence
from typing import TypeVar

from core.base.change.changed import Changed
from core.base.change.created import Created
from core.base.change.event_log import HIDDEN
from core.base.change.event_type import EventType
from core.base.change.logged_event import LoggedEvent
from core.base.change.updated import Updated
from core.base.model.model import Model
from core.base.model.move import Move
from core.base.model.table import loaded
from core.base.model.tables import Tables
from core.base.query.queries import Queries
from core.base.query.conditions.among import Among

M = TypeVar("M", bound=Model)
CREATION = ".create"


class EventBuilder:
    """Builds the typed event a commit listener declared from an entry of the event log: the row as it stands now,
    or nothing when the row is gone."""

    def __init__(self, queries: Queries, tables: Tables) -> None:
        self.queries, self.tables = queries, tables
        self.row_ids: dict[str, tuple[int, ...]] = {}

    def prepare(self, events: Sequence[LoggedEvent]) -> None:
        self.row_ids = {table: tuple(sorted({event.row_id for event in events if event.row_table == table})) for table in {event.row_table for event in events}}

    def built(self, event_type: EventType, logged: LoggedEvent) -> object | None:
        if event_type.model is None or not issubclass(event_type.event_class, Changed):
            return event_type.event_class()
        query = self.queries.query(event_type.model)
        row_ids = self.row_ids.get(logged.row_table, tuple([logged.row_id]))
        row = next((row for row in query.matching(Among("id", row_ids)).kept_rows() if row.id == logged.row_id), None)
        if row is None:
            return None
        event_class = self.event_class(event_type.event_class, logged)
        if not issubclass(event_class, Updated):
            return event_class(row)
        return event_class(row, self.old_row(row, logged), self.move(row, logged))

    def event_class(self, declared: type, logged: LoggedEvent) -> type:
        if declared is not Changed:
            return declared
        return Created if logged.event.endswith(CREATION) else Updated

    def old_row(self, row: M, logged: LoggedEvent) -> M:
        table = self.tables.table(type(row))
        return replace(row, **{name: loaded(table.types[name], values[0]) for name, values in logged.data.items() if name in table.types and values[0] != HIDDEN})

    def move(self, row: Model, logged: LoggedEvent) -> Move | None:
        name = logged.event.split(".")[1]
        return next((move for move in row.lifecycle.moves() if move.name == name), None) if row.lifecycle else None
