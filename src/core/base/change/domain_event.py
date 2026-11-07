from collections.abc import Sequence
from dataclasses import dataclass
from typing import ClassVar

from core.base.change.changed import Changed, M
from core.base.model.model import Model
from core.base.model.move import Move


@dataclass(frozen=True)
class DomainEvent(Changed[M]):
    """A change its model gives a name of its own, such as hook_call.compact."""

    change_name: ClassVar[str]

    @classmethod
    def pattern(cls, model: type[Model], moves: Sequence[Move]) -> str:
        return f"{model.model_name}.{cls.change_name}"
