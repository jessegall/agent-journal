from dataclasses import dataclass

from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model
from engine.time.timestamp import Timestamp
from core.modules.drivers.models.enums.wake_state import WakeState


@dataclass(frozen=True, kw_only=True)
class AgentWake(EnvironmentScoped, Model):
    """The durable obligation to give an agent a turn for its causes in one work generation, from the step that
    wrote it to the turn that acknowledged it; one active row per agent and work generation."""

    model_name = "agent_wake"
    cli_name = "agent-wake"

    session_agent_id: int
    environment_id: int = 0
    work_number: str
    session_number: int
    causes: str = "[]"
    lines: tuple[str, ...] = ()
    state: WakeState = WakeState.OPEN
    transport: str = ""
    lease_ends_at: Timestamp | None = None
    attempts: int = 0
    next_attempt_at: Timestamp | None = None
    failure: str = ""
    acknowledged_at: Timestamp | None = None

    def is_due_for_claim(self, timestamp: Timestamp) -> bool:
        match self.state:
            case WakeState.OPEN:
                return True
            case WakeState.CLAIMED:
                return self.lease_ends_at is None or self.lease_ends_at.value <= timestamp.value
            case WakeState.DELIVERED:
                return self.next_attempt_at is None or self.next_attempt_at.value <= timestamp.value
            case _:
                return False
