from collections.abc import Sequence
from dataclasses import dataclass

from engine.change.changed import Changed, M
from core.base.model.model import Model
from core.base.model.move import Move


@dataclass(frozen=True)
class Created(Changed[M]):
    """A new row."""

    @classmethod
    def pattern(cls, model: type[Model], moves: Sequence[Move]) -> str:
        return f"{model.model_name}.create"
