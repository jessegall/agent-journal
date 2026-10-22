from dataclasses import dataclass

from journal.engine.base_state import BaseState
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.stop import Stop
from journal.events.rows.plan_started import PlanStarted
from journal.events.rows.task_started import TaskStarted
from journal.features.tasks.states.working import Working


@dataclass(frozen=True)
class PlansWorking(Working):
    """On one task with plans on: a stop is held while an approved plan waits to start, and the task in hand joining the plan started here, or a plan starting with it, turns the work into the plan's; every other moment is Working's."""

    def is_plan_work(self) -> bool:
        return False

    def plan_state(self, **fields) -> BaseState:
        from journal.features.plans.states.following_plan import FollowingPlan
        return FollowingPlan(**fields)

    def on_stop(self, event: Stop, settings: Settings) -> Transition:
        from journal.features.plans.feature import Plans
        approved = event.data.part(Plans).approved
        if approved:
            return self.refuse(Plans.APPROVED_UNSTARTED.create(n=approved[0]))
        return super().on_stop(event, settings)

    def on_task_started(self, event: TaskStarted, settings: Settings) -> Transition:
        from journal.features.plans.feature import Plans
        started = event.data.part(Plans).started
        if self.is_plan_work() or started is None or event.task_id != self.task_id or event.task_id not in started.tasks:
            return self.none()
        return self.swap(self.plan_state(plan_id=started.plan_id, task_id=self.task_id, approved=True, logged_at=self.logged_at))

    def on_plan_started(self, event: PlanStarted, settings: Settings) -> Transition:
        if self.is_plan_work() or event.task_id != self.task_id:
            return self.none()
        return self.swap(self.plan_state(plan_id=event.plan_id, task_id=self.task_id, approved=True, logged_at=self.logged_at, edits=self.edits, active_at=self.active_at))
