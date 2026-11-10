from collections.abc import Sequence
from dataclasses import dataclass
from typing import ClassVar

from engine.change.changed import M
from engine.change.missing_move_error import MissingMoveError
from engine.change.updated import Updated
from engine.model.model import Model
from engine.model.move import Move


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
