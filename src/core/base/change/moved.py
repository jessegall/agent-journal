from collections.abc import Sequence
from dataclasses import dataclass
from typing import ClassVar

from core.base.change.changed import M
from core.base.change.missing_move_error import MissingMoveError
from core.base.change.updated import Updated
from core.base.model.model import Model
from core.base.model.move import Move


@dataclass(frozen=True)
class Moved(Updated[M]):
    """A row that took one of the moves named on the listener or on this class."""

    moves: ClassVar[Sequence[Move]] = ()

    @property
    def required_move(self) -> Move:
        if self.move is None:
            raise MissingMoveError("a moved row names its move")
        return self.move

    @classmethod
    def pattern(cls, model: type[Model], moves: Sequence[Move]) -> str:
        return "|".join(f"{model.model_name}.{move.name}" for move in moves or cls.moves)
