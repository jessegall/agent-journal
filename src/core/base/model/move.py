from collections.abc import Sequence
from dataclasses import dataclass

from core.base.model.added_state import StateValue


@dataclass(frozen=True)
class Move:
    """One step a row's state may take: from which states, to which state, and the name a person types for it.
    """

    name: str
    sources: Sequence[StateValue]
    target: StateValue
