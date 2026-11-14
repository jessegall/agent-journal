from dataclasses import replace
from collections.abc import Sequence
from typing import TypeVar

from engine.event.changed import Changed, is_changed_class
from engine.event.created import Created
from engine.event.deleted import Deleted
from engine.event.event_type import EventType
from engine.event.logged_event import LoggedEvent
from engine.event.updated import Updated
from engine.model.model import Model
from engine.model.move import Move
from engine.model.state_book import StateBook
from engine.model.tables import Tables
from engine.listener.rows.event_rows import EventRows

M = TypeVar("M", bound=Model)


class EventBuilder:
    """Builds typed events from current rows and restores public deleted fields from their logged values."""

    def __init__(self, rows: EventRows, tables: Tables, book: StateBook) -> None:
        self.rows, self.tables, self.book = rows, tables, book

    def built(self, event_type: EventType, logged: LoggedEvent) -> object | None:
        if not is_changed_class(event_type.event_class):
            return event_type.event_class()
        if event_type.model is None:
            raise TypeError(f"{event_type.event_class.__name__} names no model")
        event_class = self.event_class(event_type.event_class, logged)
        if issubclass(event_class, Deleted):
            return self.deleted(event_type.model, logged)
        row = self.rows.find(event_type.model, logged.row_id)
        if row is None:
            return None
        if not issubclass(event_class, Updated):
            return event_class(row)
        return event_class(row, self.old_row(row, logged), self.move(row, logged))

    def prepare(self, event_type: EventType, events: Sequence[LoggedEvent]) -> None:
        if event_type.model is not None and issubclass(event_type.event_class, Changed):
            self.rows.prepare(event_type.model, [event.row_id for event in events if not event.is_deletion])

    def event_class(self, declared: type[Changed[Model]], logged: LoggedEvent) -> type[Changed[Model]]:
        if declared is not Changed:
            return declared
        if logged.is_deletion:
            return Deleted
        return Created if logged.is_creation else Updated

    def deleted(self, model: type[M], logged: LoggedEvent) -> Deleted[M] | None:
        if model.hidden_fields:
            return None
        table = self.tables.table(model)
        values = {name: table.loaded_column(name, pair[0]) for name, pair in logged.data.items() if name in table.types}
        return Deleted(table.new_model({**values, "id": logged.row_id}))

    def old_row(self, row: M, logged: LoggedEvent) -> M:
        table = self.tables.table(type(row))
        return replace(row, **{name: table.loaded_column(name, values[0]) for name, values in logged.data.items() if name in table.types and name not in row.hidden_fields})

    def move(self, row: Model, logged: LoggedEvent) -> Move | None:
        lifecycle = self.book.lifecycle(type(row))
        if lifecycle is None:
            return None
        name = logged.event.split(".")[1]
        return next((move for move in lifecycle.moves() if move.name == name), None)
