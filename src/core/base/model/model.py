from dataclasses import dataclass, field, replace
from enum import StrEnum
from typing import ClassVar, Self

from core.base.metadata import Metadata
from core.base.model.lifecycle import Lifecycle
from core.base.model.move import Move
from core.base.moment import Moment

STATE = "state"


class ModelFault(Exception):
    """Raised when a model is changed in a way it never allows, such as setting its state directly."""


@dataclass(frozen=True, kw_only=True)
class Model:
    """A row of the database as an object that cannot be changed in place; every change makes a copy."""

    name: ClassVar[str]
    cli_noun: ClassVar[str]
    lifecycle: ClassVar[type[Lifecycle] | None] = None

    id: int = 0
    version: int = 0
    metadata: Metadata = field(default_factory=Metadata)
    created_at: Moment | None = None
    updated_at: Moment | None = None
    move: Move | None = field(default=None, compare=False)

    @property
    def is_saved(self) -> bool:
        return self.id > 0

    def changed(self, **values: object) -> Self:
        if self.lifecycle is not None and STATE in values:
            raise ModelFault(f"{type(self).__name__}.changed cannot set the state: ask for a move")
        return replace(self, **values)

    def moved(self, move: Move, **values: object) -> Self:
        if self.lifecycle is None or move not in self.lifecycle.moves():
            raise ModelFault(f"{move.name} is no move of {type(self).__name__}")
        return replace(self, **{STATE: move.target, "move": move, **values})

    def saved(self, id: int, version: int, moment: Moment) -> Self:
        return replace(self, id=id, version=version, created_at=self.created_at or moment, updated_at=moment, move=None)

    def current_state(self) -> StrEnum:
        return getattr(self, STATE)
