from dataclasses import dataclass, fields
from typing import Generic, TypeVar

from engine.actor.actor import Actor
from engine.change.changed import Changed, is_changed_class
from engine.change.created import Created
from engine.change.deleted import Deleted
from engine.change.event_subscriber import EventSubscriber
from engine.change.moved import Moved
from engine.change.updated import Updated
from engine.command.context import Context
from core.base.model.model import Model
from core.base.model.move import Move
from engine.change.missing_row_error import MissingRowError


M = TypeVar("M", bound=Model, covariant=True)
R = TypeVar("R", bound=Model)
METADATA = "metadata"
BOOKKEEPING_FIELDS = ("id", "version", METADATA, "created_at", "updated_at", "move")


@dataclass(frozen=True)
class Change(Generic[M]):
    """A change about to be saved: the row as it is now, the row as it will be, and who asked for it."""

    old_row: M | None
    new_row: M | None
    context: Context

    def __post_init__(self) -> None:
        if self.old_row is None and self.new_row is None:
            raise MissingRowError("a change needs an old row, a new row or both")

    @staticmethod
    def event_change(event: Changed[R], context: Context) -> "Change[R]":
        if isinstance(event, Deleted):
            return Change(event.old_row or event.row, None, context)
        return Change(event.old_row, event.row, context)

    @property
    def row(self) -> M:
        if self.new_row is not None:
            return self.new_row
        if self.old_row is not None:
            return self.old_row
        raise MissingRowError("a change needs an old row, a new row or both")

    @property
    def actor(self) -> Actor:
        return self.context.actor

    @property
    def move(self) -> Move | None:
        return self.new_row.move if self.new_row else None

    @property
    def fields(self) -> list[str]:
        if self.old_row is None or self.new_row is None:
            return []
        return [field.name for field in fields(self.row) if field.name not in BOOKKEEPING_FIELDS and getattr(self.old_row, field.name) != getattr(self.new_row, field.name)]

    @property
    def has_metadata_change(self) -> bool:
        return self.old_row is not None and self.new_row is not None and self.old_row.metadata != self.new_row.metadata

    @property
    def stored_fields(self) -> list[str]:
        return [*self.fields, METADATA] if self.has_metadata_change else self.fields

    @property
    def is_empty(self) -> bool:
        return self.old_row is not None and self.new_row is not None and self.move is None and not self.fields

    def typed_event(self, subscriber: type[EventSubscriber[object]]) -> object:
        declared = subscriber.event_type(self.event).event_class
        if not is_changed_class(declared):
            raise TypeError(f"{declared.__name__} is no row event")
        return (self.event_class() if declared is Changed else declared)(self.row, self.old_row, self.move)

    def event_class(self) -> type[Changed[Model]]:
        if self.new_row is None:
            return Deleted
        if self.old_row is None:
            return Created
        return Moved if self.move is not None else Updated

    @property
    def event(self) -> str:
        name = self.row.model_name
        if self.new_row is None:
            return f"{name}.delete"
        if self.old_row is not None and self.move is not None:
            return f"{name}.{self.move.name}"
        change_name = self.new_row.change_name(self.old_row)
        if change_name is not None:
            return f"{name}.{change_name}"
        return f"{name}.create" if self.old_row is None else f"{name}.update"
