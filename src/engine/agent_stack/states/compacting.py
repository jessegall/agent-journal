from dataclasses import dataclass
from typing import ClassVar

from engine.agent_stack.states.state import State
from engine.enums.stack_level import StackLevel


@dataclass(frozen=True)
class Compacting(State):
    """A compaction of this context generation is due or running; the stop under it is the compaction handoff."""

    lane: ClassVar[StackLevel] = StackLevel.SAFETY
    rank: ClassVar[int] = 40
    context_generation: int
    cause: str
    attempt: int
    is_running: bool
