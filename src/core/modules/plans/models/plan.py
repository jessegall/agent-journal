from dataclasses import dataclass
from engine.actor.actor import Actor
from engine.enums.actor_count import ActorCount
from engine.model.assignable import Assignable
from engine.model.children import Children
from engine.model.environment_scoped import EnvironmentScoped
from engine.model.model import Model
from engine.model.state_holder import StateHolder
from engine.time.timestamp import Timestamp
from core.modules.tasks.models.task import check_title
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.lifecycles.plan_lifecycle import PlanLifecycle
from core.modules.plans.models.phase import Phase


@dataclass(frozen=True, kw_only=True)
class Plan(EnvironmentScoped, Model, StateHolder, Assignable):
    """A goal reached by tasks placed in ordered phases; it is made ready, approved by a user, then
    followed. Its design document, when it has one, is linked to it. One actor holds a plan, and its
    assignment also assigns its phases and through them their tasks."""

    model_name = "plan"
    cli_name = "plan"
    search_fields = ["title", "brief"]
    lifecycle = PlanLifecycle
    added_state_moves = tuple([PlanLifecycle.cancel])
    takes_actors = ActorCount.SINGLE
    assigns = tuple([Children(Phase, "plan_id")])

    environment_id: int = 0
    creator_id: int
    title: str
    brief: str = ""
    state: PlanState = PlanState.DRAFT
    reason: str = ""
    started_at: Timestamp | None = None
    closed_at: Timestamp | None = None
    document_id: int | None = None

    def __post_init__(self) -> None:
        check_title(self.cli_name, self.title)

    def start(self, timestamp: Timestamp, actor: Actor) -> "Plan":
        return self.moved(PlanLifecycle.start, started_at=self.started_at or timestamp)

    def unblock(self, timestamp: Timestamp, actor: Actor) -> "Plan":
        return self.moved(PlanLifecycle.unblock, reason="")

    def close(self, timestamp: Timestamp, actor: Actor) -> "Plan":
        return self.moved(PlanLifecycle.close, closed_at=timestamp)

    def cancel(self, timestamp: Timestamp, actor: Actor, reason: str) -> "Plan":
        return self.moved(PlanLifecycle.cancel, reason=reason, closed_at=timestamp)
