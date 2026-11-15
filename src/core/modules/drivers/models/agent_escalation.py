from dataclasses import dataclass

from engine.enums.escalation_type import EscalationType
from engine.enums.responder import Responder
from engine.model.model import Model
from engine.time.timestamp import Timestamp
from core.modules.drivers.models.enums.escalation_state import EscalationState


@dataclass(frozen=True, kw_only=True)
class AgentEscalation(Model):
    """An agent refused its limit of stops or tool calls in a row, and who was asked: the blocks and the work it
    defers, the count, and how it ended. It is no end of any block."""

    model_name = "agent_escalation"
    cli_name = "agent-escalation"

    session_agent_id: int
    environment_id: int
    escalation_type: EscalationType
    responder: Responder
    refusal_count: int
    block_ids: tuple[int, ...] = ()
    work_keys: tuple[str, ...] = ()
    state: EscalationState = EscalationState.OPEN
    answer: str = ""
    ended_at: Timestamp | None = None
