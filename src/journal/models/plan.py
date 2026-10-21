from dataclasses import dataclass
from typing import ClassVar

from journal.models.plan_state import PlanState
from journal.events.rows.plan_approved import PlanApproved
from journal.events.rows.plan_blocked import PlanBlocked
from journal.events.rows.plan_reopened import PlanReopened
from journal.events.rows.plan_started import PlanStarted
from journal.models.scoped import Scoped
from journal.models.task import Task
from journal.support.refused import Refused


@dataclass(frozen=True)
class Plan(Scoped):
    """Ordered work: its phases and tasks are linked to it. Built as draft, made ready by the agent, held in review while reviewers read it, counting those still out, approved by the user, then followed: finishing one task starts the next."""

    text_fields: ClassVar[tuple[str, ...]] = ("title", "brief")

    title: str = ""
    brief: str = ""
    state: PlanState = PlanState.DRAFT
    blocked_why: str = ""
    reviewers: int = 0

    def ready(self) -> "Plan":
        return self.moved(PlanState.READY)

    def reviewing(self) -> "Plan":
        return self.moved(PlanState.REVIEWING)

    def approved(self, at: float, by_user: bool) -> "Plan":
        return self.moved(PlanState.APPROVED).with_event(PlanApproved(environment_id=self.environment_id, at=at, plan_id=self.id, by_user=by_user))

    def started(self, first: Task, at: float) -> "Plan":
        return self.moved(PlanState.STARTED).with_event(PlanStarted(environment_id=self.environment_id, at=at, plan_id=self.id, task_id=first.id))

    def started_with_nothing_to_start(self, at: float) -> "Plan":
        return self.moved(PlanState.STARTED).with_event(PlanStarted(environment_id=self.environment_id, at=at, plan_id=self.id, task_id=0))

    def parked(self) -> "Plan":
        return self.moved(PlanState.PARKED)

    def blocked(self, why: str, at: float) -> "Plan":
        return self.moved(PlanState.BLOCKED).with_(blocked_why=why).with_event(PlanBlocked(environment_id=self.environment_id, at=at, plan_id=self.id, why=why))

    def unblocked(self, why: str, at: float) -> "Plan":
        return self.moved(PlanState.STARTED).with_(blocked_why="").with_event(PlanReopened(environment_id=self.environment_id, at=at, plan_id=self.id, why=why))

    def is_blocked(self) -> bool:
        return self.state == PlanState.BLOCKED

    def done(self) -> "Plan":
        return self.moved(PlanState.DONE)

    def cancelled(self) -> "Plan":
        return self.moved(PlanState.CANCELLED)

    def moved(self, state: PlanState) -> "Plan":
        if not self.state.can_become(state):
            raise Refused(f"plan {self.id} is {self.state} and cannot become {state}")
        return self.with_(state=state)

