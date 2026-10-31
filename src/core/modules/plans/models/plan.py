from dataclasses import dataclass
from core.base.actor import Actor
from core.base.model.model import Model
from core.base.timestamp import Timestamp
from core.modules.tasks.models.task import check_title
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.lifecycles.plan_lifecycle import PlanLifecycle


@dataclass(frozen=True, kw_only=True)
class Plan(Model):
    """A goal reached by tasks placed in ordered phases; it is made ready, approved by a person, then followed."""

    model_name = "plan"
    cli_name = "plan"
    lifecycle = PlanLifecycle

    environment_id: int
    creator_id: int
    title: str
    brief: str = ""
    state: PlanState = PlanState.DRAFT
    reason: str = ""
    closed_at: Timestamp | None = None

    def __post_init__(self) -> None:
        check_title(self.cli_name, self.title)

    def close(self, timestamp: Timestamp, actor: Actor) -> "Plan":
        return self.moved(PlanLifecycle.close, closed_at=timestamp)

    def cancel(self, timestamp: Timestamp, actor: Actor, reason: str) -> "Plan":
        return self.moved(PlanLifecycle.cancel, reason=reason, closed_at=timestamp)
