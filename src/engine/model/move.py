from collections.abc import Sequence
from dataclasses import dataclass

from engine.model.added_state import StateValue


@dataclass(frozen=True)
class Move:
    """One step a row's state may take: from which states, to which state, and the name a user types for
    it. A move the journal makes by its own work has no command, so a refusal never names it as one a user
    may type."""

    name: str
    sources: Sequence[StateValue]
    target: StateValue
    has_command: bool = True
