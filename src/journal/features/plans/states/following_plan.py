from dataclasses import dataclass, replace

from journal.engine.nudge import Nudge
from journal.engine.support.block import Block
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.stop import Stop
from journal.events.agent.session_started import SessionStarted
from journal.events.agent.tool_starting import ToolStarting
from journal.events.rows.plan_abandoned import PlanAbandoned
from journal.events.rows.plan_finished import PlanFinished
from journal.events.rows.plan_postponed import PlanPostponed
from journal.events.rows.task_closed import TaskClosed
from journal.events.rows.task_started import TaskStarted
from journal.events.feature_data import FeatureData
from journal.features.plans.states.plans_working import PlansWorking


@dataclass(frozen=True)
class FollowingPlan(PlansWorking):
    """Working with a plan in hand, for the plan's whole life. A finished task starts the next: the plans feature writes it and the state keeps the top as that task; a task started outside the plan is the task in hand all the same, since one task is in hand at a time. At a checkpoint the state has no task in hand: the stop waits for the user, or in auto mode is refused and the agent told to go on. Popped when the plan is done, postponed or abandoned, and on resume when the plan is no longer the one started here."""

    name = "following_plan"
    title = "Following a plan"
    plan_id: int = 0
    approved: bool = False
    origin_state: int = 0
    checkpoint_pause: bool = False
    phase: int = 0

    def is_plan_work(self) -> bool:
        return True

    def label(self) -> str:
        return super().label() if self.task_id else f"plan {self.plan_id}, with no task in hand"

    def on_push(self, settings: Settings) -> tuple[Nudge, ...] | Block:
        from journal.features.plans.feature import Plans
        return () if self.approved else Block(Plans.UNAPPROVED_PLAN.create(n=self.plan_id))

    def on_stop(self, event: Stop, settings: Settings) -> Transition:
        from journal.features.plans.feature import Plans
        from journal.features.tasks.feature import Tasks
        if not self.checkpoint_pause:
            return super().on_stop(event, settings)
        if event.prior_refusal:
            return self.none()
        if settings.value(Tasks.AUTO):
            return self.refuse(Plans.PHASE_END.create(n=self.plan_id, phase=self.phase))
        return self.none(Plans.CHECKPOINT_PHASE_END.create(n=self.plan_id, phase=self.phase))

    def on_session_started(self, event: SessionStarted, settings: Settings) -> Transition:
        from journal.features.plans.feature import Plans
        if self.checkpoint_pause:
            return self.none(Plans.CHECKPOINT_PHASE_END.create(n=self.plan_id, phase=self.phase))
        return super().on_session_started(event, settings)

    def on_tool_starting(self, event: ToolStarting, settings: Settings) -> Transition:
        return self.none() if self.checkpoint_pause else super().on_tool_starting(event, settings)

    def on_task_started(self, event: TaskStarted, settings: Settings) -> Transition:
        from journal.features.tasks.feature import Tasks
        if event.task_id not in event.data.part(Tasks).agent_tasks:
            return self.none()
        return self.swap(replace(self, task_id=event.task_id, checkpoint_pause=False, phase=0, logged_at=event.time, edits=0))

    def on_task_closed(self, event: TaskClosed, settings: Settings) -> Transition:
        from journal.features.plans.feature import Plans
        if event.task_id != self.task_id:
            return self.none()
        started = event.data.part(Plans).started
        if started is not None and started.checkpoint_pause:
            return self.swap(replace(self, task_id=0, origin_state=event.task_id, checkpoint_pause=True, phase=started.checkpoint_phase))
        return self.swap(replace(self, task_id=0, origin_state=event.task_id))

    def on_plan_finished(self, event: PlanFinished, settings: Settings) -> Transition:
        from journal.features.plans.feature import Plans
        return self.pop(Plans.PLAN_FINISHED.create(n=event.plan_id)) if event.plan_id == self.plan_id else self.none()

    def on_plan_postponed(self, event: PlanPostponed, settings: Settings) -> Transition:
        from journal.features.plans.feature import Plans
        if event.plan_id != self.plan_id:
            return self.none()
        return self.pop(Plans.PLAN_POSTPONED.create(n=event.plan_id)) if event.user_origin else self.pop()

    def on_plan_abandoned(self, event: PlanAbandoned, settings: Settings) -> Transition:
        from journal.features.plans.feature import Plans
        if event.plan_id != self.plan_id:
            return self.none()
        return self.pop(Plans.PLAN_ABANDONED.create(n=event.plan_id)) if event.user_origin else self.pop()

    def on_resume(self, data: FeatureData, settings: Settings) -> tuple[Nudge, ...] | Transition:
        from journal.features.plans.feature import Plans
        started = data.part(Plans).started
        if started is None or started.plan_id != self.plan_id:
            return self.pop()
        if started.started_task and started.started_task != self.task_id:
            return self.swap(replace(self, task_id=started.started_task, checkpoint_pause=False, phase=0, edits=0))
        return super().on_resume(data, settings)
