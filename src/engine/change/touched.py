from collections.abc import Sequence
from dataclasses import dataclass
from typing import Generic

from engine.change.changed import M
from core.base.model.model import Model
from core.base.model.move import Move


@dataclass(frozen=True)
class Touched(Generic[M]):
    """Something happened to rows of this model, for a commit listener that does not read the row: none is loaded."""

    @classmethod
    def pattern(cls, model: type[Model], moves: Sequence[Move]) -> str:
        return "*" if model is Model else f"{model.model_name}.*"