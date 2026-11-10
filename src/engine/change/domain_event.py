from collections.abc import Sequence
from dataclasses import dataclass
from typing import ClassVar

from engine.change.changed import Changed, M
from engine.model.model import Model
from engine.model.move import Move


@dataclass(frozen=True)
class DomainEvent(Changed[M]):
    """A change its model gives a name of its own, such as hook_call.compact."""

    change_name: ClassVar[str]

    @classmethod
    def pattern(cls, model: type[Model], moves: Sequence[Move]) -> str:
        return f"{model.model_name}.{cls.change_name}"
