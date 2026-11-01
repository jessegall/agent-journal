from collections.abc import Sequence
from dataclasses import dataclass, field, replace
from enum import StrEnum
from typing import ClassVar, Self
from core.base.metadata import Metadata
from core.base.model.lifecycle import Lifecycle
from core.base.model.move import Move
from core.base.timestamp import Timestamp
from core.base.model.model_error import ModelError


STATE = "state"
@dataclass(frozen=True, kw_only=True)
class Model:
    """A row of the database as an object that cannot be changed in place; every change makes a copy."""

    model_name: ClassVar[str]
    cli_name: ClassVar[str]
    lifecycle: ClassVar[type[Lifecycle] | None] = None
    hidden_fields: ClassVar[frozenset[str]] = frozenset()
    search_fields: ClassVar[Sequence[str]] = ()

    id: int = 0
    version: int = 0
    metadata: Metadata = field(default_factory=Metadata)
    created_at: Timestamp | None = None
    updated_at: Timestamp | None = None
    move: Move | None = field(default=None, compare=False)

    def creation_timestamp(self) -> Timestamp:
        if self.created_at is None:
            raise ModelError(f"{type(self).__name__} {self.id} was never saved")
        return self.created_at

    def update_timestamp(self) -> Timestamp:
        return self.updated_at if self.updated_at is not None else self.creation_timestamp()

    def search_text(self) -> str:
        return " ".join(str(getattr(self, name)) for name in self.search_fields)

    @property
    def is_saved(self) -> bool:
        return self.version > 0

    def changed(self, **values: object) -> Self:
        if self.lifecycle is not None and STATE in values:
            raise ModelError(f"{type(self).__name__}.changed cannot set the state: ask for a move")
        return replace(self, **values)

    def moved(self, move: Move, **values: object) -> Self:
        if self.lifecycle is None or move not in self.lifecycle.moves():
            raise ModelError(f"{move.name} is no move of {type(self).__name__}")
        return replace(self, **{STATE: move.target, "move": move, **values})

    def saved(self, id: int, version: int, timestamp: Timestamp) -> Self:
        return replace(self, id=id, version=version, created_at=self.created_at or timestamp, updated_at=timestamp, move=None)

    def current_state(self) -> StrEnum:
        return getattr(self, STATE)
