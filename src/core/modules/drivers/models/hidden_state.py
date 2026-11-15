from dataclasses import dataclass

from engine.model.model import Model
from engine.time.timestamp import Timestamp

OPEN_SUPPRESSIONS_REASON = "the frames a person removed from one agent, a handful at most"


@dataclass(frozen=True, kw_only=True)
class HiddenState(Model):
    """A person's removal of a Working frame: the need gets no frame while the row is open, and the task stays
    assigned and started. It ends by a restore or a new assignment of the work."""

    model_name = "hidden_state"
    cli_name = "agent-frame-suppression"

    session_agent_id: int
    state_key: str
    person_id: int
    reason: str
    ended_at: Timestamp | None = None
