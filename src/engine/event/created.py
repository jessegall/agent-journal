from collections.abc import Sequence
from dataclasses import dataclass

from engine.event.changed import Changed, M
from engine.model.move import Move


@dataclass(frozen=True)
class Created(Changed[M]):
    """A new row."""

    @classmethod
    def pattern(cls, model: type, moves: Sequence[Move]) -> str:
        return f"{cls.row_name(model)}.create"
