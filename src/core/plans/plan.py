from dataclasses import dataclass
from enum import StrEnum

from core.base.actor import Actor
from core.base.model.lifecycle import Lifecycle
from core.base.model.model import Model
from core.base.model.move import Move
from core.base.moment import Moment
from core.tasks.task import check_title


class PlanState(StrEnum):
    """Where a plan stands: drafted, made ready for approval, approved, followed, or finished."""

    DRAFT = "draft"
    READY = "ready"
    APPROVED = "approved"
    STARTED = "started"
    PAUSED = "paused"
    BLOCKED = "blocked"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class PlanLifecycle(Lifecycle):
    states = PlanState
    initial = (PlanState.DRAFT,)
    editable = (PlanState.DRAFT, PlanState.READY, PlanState.APPROVED, PlanState.STARTED, PlanState.PAUSED, PlanState.BLOCKED)
    deletable = (PlanState.DRAFT, PlanState.CANCELLED)

    ready = Move("ready", (PlanState.DRAFT,), PlanState.READY)
    approve = Move("approve", (PlanState.READY,), PlanState.APPROVED)
    start = Move("start", (PlanState.APPROVED,), PlanState.STARTED)
    pause = Move("pause", (PlanState.STARTED,), PlanState.PAUSED)
    resume = Move("resume", (PlanState.PAUSED,), PlanState.STARTED)
    block = Move("block", (PlanState.STARTED, PlanState.PAUSED), PlanState.BLOCKED)
    unblock = Move("unblock", (PlanState.BLOCKED,), PlanState.STARTED)
    close = Move("close", (PlanState.STARTED,), PlanState.COMPLETED)
    cancel = Move("cancel", (PlanState.DRAFT, PlanState.READY, PlanState.APPROVED, PlanState.STARTED, PlanState.PAUSED, PlanState.BLOCKED),
                  PlanState.CANCELLED)


@dataclass(frozen=True, kw_only=True)
class Plan(Model):
    """A goal reached by tasks placed in ordered phases; it is made ready, approved by a person, then followed."""

    model_name = "plan"
    cli_noun = "plan"
    lifecycle = PlanLifecycle

    environment_id: int
    creator_id: int
    title: str
    brief: str = ""
    state: PlanState = PlanState.DRAFT
    reason: str = ""
    closed_at: Moment | None = None

    def __post_init__(self) -> None:
        check_title(self.cli_noun, self.title)

    def close(self, moment: Moment, actor: Actor) -> "Plan":
        return self.moved(PlanLifecycle.close, closed_at=moment)

    def cancel(self, moment: Moment, actor: Actor, reason: str) -> "Plan":
        return self.moved(PlanLifecycle.cancel, reason=reason, closed_at=moment)
