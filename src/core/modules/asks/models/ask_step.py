from dataclasses import dataclass, replace

from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model
from engine.time.timestamp import Timestamp
from core.modules.asks.models.enums.ask_step_state import AskStepState


@dataclass(frozen=True, kw_only=True)
class AskStep(EnvironmentScoped, Model):
    """One level a question reached: the helper and job that hold it there, when it is due, and how that level
    ended it or passed it on."""

    model_name = "ask_step"
    cli_name = "ask-step"

    environment_id: int = 0
    ask_id: int
    profile: str = ""
    helper_id: int | None = None
    job_id: int | None = None
    state: AskStepState = AskStepState.WAITING
    received_at: Timestamp | None = None
    due_at: Timestamp | None = None
    forward_at: Timestamp | None = None
    visit_count: int = 0
    reason: str = ""
    tried: str = ""
    options_json: str = "[]"
    recommendation: str = ""
    passed_by_journal: bool = False

    def ended_as(self, state: AskStepState, reason: str) -> "AskStep":
        return replace(self, state=state, reason=reason)

    def delivered_to(self, helper_id: int, job_id: int | None, timestamp: Timestamp, due_at: Timestamp, forward_at: Timestamp) -> "AskStep":
        return replace(self, state=AskStepState.DELIVERED, helper_id=helper_id, job_id=job_id, received_at=timestamp, due_at=due_at, forward_at=forward_at, visit_count=self.visit_count + 1)
