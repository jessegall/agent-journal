from dataclasses import dataclass
from datetime import datetime
from typing import ClassVar

from engine.agent_stack.states.state import State
from engine.enums.lane import Lane


@dataclass(frozen=True)
class Stopped(State):
    """The bottom of every stack: the agent has no work in hand, since when, why, and whether it can be
    resumed."""

    lane: ClassVar[Lane] = Lane.BOTTOM
    rank: ClassVar[int] = 0
    stopped_at: datetime
    cause: str
    can_resume: bool
