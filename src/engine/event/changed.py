from collections.abc import Sequence
from dataclasses import dataclass
from typing import Generic, TypeIs, TypeVar

from engine.model.model import Model
from engine.model.move import Move

M = TypeVar("M", bound=Model, covariant=True)


@dataclass(frozen=True)
class Changed(Generic[M]):
    """Any change of a row: the row after it, or as it last stood when it was deleted, the row before it, and the
    move that took it there."""

    row: M
    old_row: M | None = None
    move: Move | None = None

    @classmethod
    def pattern(cls, model: type, moves: Sequence[Move]) -> str:
        return f"{cls.row_name(model)}.*"

    @staticmethod
    def row_name(model: type) -> str:
        return model.model_name if issubclass(model, Model) and model is not Model else "*"


def is_changed_class(class_type: type) -> TypeIs[type[Changed[Model]]]:
    return issubclass(class_type, Changed)


RowChange = TypeVar("RowChange", bound=Changed[Model], contravariant=True)
