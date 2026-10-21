from dataclasses import dataclass, replace

from journal.engine.nudge import Nudge
from journal.engine.support.held import Held
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.idle import Idle as Stop
from journal.events.agent.session_started import SessionStarted
from journal.events.agent.tool_starting import ToolStarting
from journal.events.rows.plan_abandoned import PlanAbandoned
from journal.events.rows.plan_done import PlanDone
from journal.events.rows.plan_postponed import PlanPostponed
from journal.events.rows.task_closed import TaskClosed
from journal.events.rows.task_started import TaskStarted
from journal.events.feature_data import FeatureData
from journal.features.tasks.states.working import Working


@dataclass(frozen=True)
class FollowingPlan(Working):
    """Working with a plan in hand, for the plan's whole life. A finished task starts the next: the plans feature writes it and the state keeps the top as that task; a task started outside the plan is the task in hand all the same, since one task is in hand at a time. At a checkpoint the state has no task in hand: the stop waits for the user, or in auto mode is refused and the agent told to go on. Popped when the plan is done, postponed or abandoned, and on resume when the plan is no longer the one started here."""

    name = "following_plan"
    title = "Following a plan"
    plan_id: int = 0
    approved: bool = False
    moved_from: int = 0
    at_checkpoint: bool = False
    phase: int = 0

    def follows_a_plan(self) -> bool:
        return True

    def named(self) -> str:
        return super().named() if self.task_id else f"plan {self.plan_id}, with no task in hand"

    def on_push(self, settings: Settings) -> tuple[Nudge, ...] | Held:
        from journal.features.plans.feature import Plans
        return () if self.approved else Held(Plans.PLAN_NOT_APPROVED.create(n=self.plan_id))

    def on_stop(self, event: Stop, settings: Settings) -> Transition:
        from journal.features.plans.feature import Plans
        from journal.features.tasks.feature import Tasks
        if not self.at_checkpoint:
            return super().on_stop(event, settings)
        if event.held_before:
            return self.unchanged()
        if settings.of(Tasks.AUTO):
            return self.hold(Plans.PHASE_COMPLETE_GO_ON.create(n=self.plan_id, phase=self.phase))
        return self.unchanged(Plans.PHASE_COMPLETE_AT_A_CHECKPOINT.create(n=self.plan_id, phase=self.phase))

    def on_session_started(self, event: SessionStarted, settings: Settings) -> Transition:
        from journal.features.plans.feature import Plans
        if self.at_checkpoint:
            return self.unchanged(Plans.PHASE_COMPLETE_AT_A_CHECKPOINT.create(n=self.plan_id, phase=self.phase))
        return super().on_session_started(event, settings)

    def on_tool_starting(self, event: ToolStarting, settings: Settings) -> Transition:
        return self.unchanged() if self.at_checkpoint else super().on_tool_starting(event, settings)

    def on_task_started(self, event: TaskStarted, settings: Settings) -> Transition:
        return self.changed(replace(self, task_id=event.task_id, at_checkpoint=False, phase=0, logged_at=event.time, edits=0))

    def on_task_closed(self, event: TaskClosed, settings: Settings) -> Transition:
        from journal.features.plans.feature import Plans
        if event.task_id != self.task_id:
            return self.unchanged()
        started = event.data.of(Plans).started
        if started is not None and started.at_checkpoint:
            return self.changed(replace(self, task_id=0, moved_from=event.task_id, at_checkpoint=True, phase=started.checkpoint_phase))
        return self.changed(replace(self, task_id=0, moved_from=event.task_id))

    def on_plan_done(self, event: PlanDone, settings: Settings) -> Transition:
        from journal.features.plans.feature import Plans
        return self.pop(Plans.PLAN_DONE.create(n=event.plan_id)) if event.plan_id == self.plan_id else self.unchanged()

    def on_plan_postponed(self, event: PlanPostponed, settings: Settings) -> Transition:
        from journal.features.plans.feature import Plans
        if event.plan_id != self.plan_id:
            return self.unchanged()
        return self.pop(Plans.THE_USER_POSTPONED_THE_PLAN.create(n=event.plan_id)) if event.by_user else self.pop()

    def on_plan_abandoned(self, event: PlanAbandoned, settings: Settings) -> Transition:
        from journal.features.plans.feature import Plans
        if event.plan_id != self.plan_id:
            return self.unchanged()
        return self.pop(Plans.THE_USER_ABANDONED_THE_PLAN.create(n=event.plan_id)) if event.by_user else self.pop()

    def on_resume(self, data: FeatureData, settings: Settings) -> tuple[Nudge, ...] | Transition:
        from journal.features.plans.feature import Plans
        started = data.of(Plans).started
        if started is None or started.plan_id != self.plan_id:
            return self.pop()
        if started.started_task and started.started_task != self.task_id:
            return self.changed(replace(self, task_id=started.started_task, at_checkpoint=False, phase=0, edits=0))
        return super().on_resume(data, settings)
