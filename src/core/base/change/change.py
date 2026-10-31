from dataclasses import dataclass, fields
from typing import Generic, TypeVar

from core.base.actor import Actor
from core.base.command.context import Context
from core.base.model.model import Model
from core.base.model.move import Move
from core.base.change.missing_row_error import MissingRowError


M = TypeVar("M", bound=Model, covariant=True)
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
    def is_empty(self) -> bool:
        return self.old_row is not None and self.new_row is not None and self.move is None and not self.fields

    @property
    def event(self) -> str:
        name = self.row.model_name
        if self.old_row is None:
            return f"{name}.create"
        if self.new_row is None:
            return f"{name}.delete"
        return f"{name}.{self.move.name}" if self.move else f"{name}.update"
