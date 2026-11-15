from dataclasses import dataclass
from typing import ClassVar

from engine.agent_stack.row_reference import RowReference
from engine.agent_stack.states.state import State
from engine.enums.stack_level import StackLevel
from engine.enums.wait_mode import WaitMode


@dataclass(frozen=True)
class Waiting(State):
    """The agent waits on subjects, any or all of them, by its own choice or not; a stop under it hands in
    nothing."""

    lane: ClassVar[StackLevel] = StackLevel.WORK
    rank: ClassVar[int] = 10
    subjects: tuple[RowReference, ...]
    wait_mode: WaitMode
    agent_chose: bool
    text: str
