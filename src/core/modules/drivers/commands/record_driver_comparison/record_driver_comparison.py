from dataclasses import dataclass

from engine.command.command import Command
from core.modules.drivers.models.enums.difference_state import DifferenceState


@dataclass(frozen=True)
class RecordDriverComparison(Command[None]):
    """Saves one event's two answers, the old walk's and the new machine's, and moves the comparison's own stack
    of the agent to the frames and counts the new machine left; the row says whether the two agreed. Nothing a
    live answer reads is written."""

    session_agent_id: int
    slice_name: str
    event_text: str
    old_answer: str
    new_answer: str
    hook_call_id: int | None
    is_replayable: bool
    frames: str
    stop_refusals: int
    tool_refusals: int
    difference_state: DifferenceState
