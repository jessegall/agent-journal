from dataclasses import dataclass

from journal.engine.base_state import BaseState
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.session_started import SessionStarted
from journal.events.feature_data import FeatureData
from journal.events.rows.plan_started import PlanStarted
from journal.events.rows.task_started import TaskStarted
from journal.features.tasks.states.ready import Ready


@dataclass(frozen=True)
class PlansReady(Ready):
    """Idle with plans on: a task of the plan this agent holds started here, the plan's start with a task this agent holds and a session that finds one started push the plan's state, and a stop is held while an approved plan waits to start; every other moment is Idle's."""

    def plan_state(self, **fields) -> BaseState:
        from journal.features.plans.states.following_plan import FollowingPlan
        return FollowingPlan(**fields)

    def working_state(self, **fields) -> BaseState:
        from journal.features.plans.states.plans_working import PlansWorking
        return PlansWorking(**fields)

    def on_session_started(self, event: SessionStarted, settings: Settings) -> Transition:
        from journal.features.plans.feature import Plans
        started = event.data.part(Plans).started
        if not started:
            return super().on_session_started(event, settings)
        active = self.active(event.time)
        return active.push(active.plan_state(plan_id=started.plan_id, task_id=started.started_task, approved=True, logged_at=event.time))

    def on_task_started(self, event: TaskStarted, settings: Settings) -> Transition:
        from journal.features.plans.feature import Plans
        from journal.features.tasks.feature import Tasks
        started = event.data.part(Plans).started
        if started and event.task_id in started.tasks and event.task_id in event.data.part(Tasks).agent_tasks:
            return self.push(self.plan_state(plan_id=started.plan_id, task_id=event.task_id, approved=True, logged_at=event.time))
        return super().on_task_started(event, settings)

    def on_plan_started(self, event: PlanStarted, settings: Settings) -> Transition:
        from journal.features.tasks.feature import Tasks
        if event.task_id and event.task_id not in event.data.part(Tasks).agent_tasks:
            return self.none()
        return self.push(self.plan_state(plan_id=event.plan_id, task_id=event.task_id, approved=True, logged_at=event.time))

    def open_work_answer(self, data: FeatureData, settings: Settings) -> Transition:
        from journal.features.plans.feature import Plans
        approved = data.part(Plans).approved
        if approved:
            return self.refuse(Plans.APPROVED_UNSTARTED.create(n=approved[0]))
        return super().open_work_answer(data, settings)
