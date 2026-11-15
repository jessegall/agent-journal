from dataclasses import dataclass

from engine.model.model import Model
from engine.time.timestamp import Timestamp


@dataclass(frozen=True, kw_only=True)
class AgentStepRequest(Model):
    """A durable request to step one agent for its causes, written in the transaction of the change that named the
    agent; one open row per agent, served by the step round."""

    model_name = "agent_step_request"
    cli_name = "agent-step-request"

    session_agent_id: int
    causes: tuple[str, ...] = ()
    attempts: int = 0
    served_at: Timestamp | None = None
