from dataclasses import dataclass
from typing import ClassVar

from engine.agent_stack.states.pause_cause import PauseCause
from engine.agent_stack.states.state import State
from engine.enums.stack_level import StackLevel


@dataclass(frozen=True)
class Paused(State):
    """The agent or an ancestor is paused: everything but its allow-list is refused and a stop is a safety
    rest."""

    level: ClassVar[StackLevel] = StackLevel.SAFETY
    rank: ClassVar[int] = 50
    causes: tuple[PauseCause, ...]
    refusal_text: str
