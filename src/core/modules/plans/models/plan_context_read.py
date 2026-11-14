from dataclasses import dataclass

from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model


@dataclass(frozen=True, kw_only=True)
class PlanContextRead(EnvironmentScoped, Model):
    """An agent's context read for one actual plan start or unblock event."""

    model_name = "plan_context_read"
    cli_name = "plan-context-read"

    environment_id: int = 0
    plan_id: int
    start_event_id: int
    session_agent_id: int
    creator_id: int
