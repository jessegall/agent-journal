from dataclasses import dataclass
from typing import ClassVar

from engine.agent_stack.subject_reference import SubjectReference
from engine.agent_stack.states.state import State
from engine.enums.lane import Lane
from engine.enums.wait_mode import WaitMode


@dataclass(frozen=True)
class Waiting(State):
    """The agent waits on subjects, any or all of them, by its own choice or not; a stop under it hands in nothing."""

    lane: ClassVar[Lane] = Lane.WORK
    rank: ClassVar[int] = 10
    subjects: tuple[SubjectReference, ...]
    wait_mode: WaitMode
    agent_chose: bool
    text: str
