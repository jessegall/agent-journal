from collections.abc import Sequence
from dataclasses import dataclass

from engine.event.changed import Changed, M
from engine.model.model import Model
from engine.model.move import Move


@dataclass(frozen=True)
class Created(Changed[M]):
    """A new row."""

    @classmethod
    def pattern(cls, model: type[Model], moves: Sequence[Move]) -> str:
        return f"{model.model_name}.create"
