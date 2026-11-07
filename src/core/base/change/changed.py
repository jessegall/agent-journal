from collections.abc import Sequence
from dataclasses import dataclass
from typing import Generic, TypeVar

from core.base.model.model import Model
from core.base.model.move import Move

M = TypeVar("M", bound=Model, covariant=True)


@dataclass(frozen=True)
class Changed(Generic[M]):
    """Any change of a row: the row after it, or as it last stood when it was deleted, the row before it, and the
    move that took it there."""

    row: M
    old_row: M | None = None
    move: Move | None = None

    @classmethod
    def pattern(cls, model: type[Model], moves: Sequence[Move]) -> str:
        return "*.*" if model is Model else f"{model.model_name}.*"
