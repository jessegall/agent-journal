from dataclasses import dataclass
from typing import ClassVar

from engine.agent_stack.states.state import State
from engine.enums.stack_level import StackLevel


@dataclass(frozen=True)
class Ended(State):
    """The agent was retired or replaced; its stack answers nothing more and the route refuses its actions."""

    level: ClassVar[StackLevel] = StackLevel.SAFETY
    rank: ClassVar[int] = 60
    cause: str
    actor_id: int
