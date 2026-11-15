from dataclasses import dataclass

from engine.model.model import Model
from engine.time.timestamp import Timestamp
from core.modules.drivers.models.enums.wake_state import WakeState


@dataclass(frozen=True, kw_only=True)
class AgentWake(Model):
    """The durable obligation to give an agent a turn for its causes in one work generation, from the step that
    wrote it to the turn that acknowledged it; one active row per agent and work generation."""

    model_name = "agent_wake"
    cli_name = "agent-wake"

    session_agent_id: int
    environment_id: int
    work_generation: str
    session_generation: int
    causes: str = "[]"
    lines: tuple[str, ...] = ()
    state: WakeState = WakeState.OPEN
    transport: str = ""
    lease_ends_at: Timestamp | None = None
    attempts: int = 0
    next_attempt_at: Timestamp | None = None
    failure: str = ""
    acknowledged_at: Timestamp | None = None
