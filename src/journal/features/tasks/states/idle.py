from dataclasses import dataclass, replace

from journal.engine.agent_state import AgentState
from journal.support.permission import Permission
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.idle import Idle as Stop
from journal.events.agent.prompt_submitted import PromptSubmitted
from journal.events.agent.session_started import SessionStarted
from journal.events.agent.ticked import Ticked
from journal.events.agent.tool_starting import ToolStarting
from journal.events.rows.plan_started import PlanStarted
from journal.events.rows.task_started import TaskStarted

ASK_ABOUT_PARKED_AFTER = 60.0
ASK_ABOUT_BLOCKED_AFTER = 45 * 60.0
CHECK_IN_AFTER = 30 * 60.0


@dataclass(frozen=True)
class Idle(AgentState):
    """Nothing in hand: the floor of the stack, never popped. A stop here is held by what is still open: a parked task, a blocked task whose check cannot run, an approved plan not started, and in auto mode any open task. The quiet is measured from the agent's last doing."""

    name = "idle"
    title = "Idle"
    allows = frozenset({Permission.RUN_COMMANDS})
    quiet_since: float = 0.0
    parked_asked: bool = False

    def active(self, time: float) -> "Idle":
        return replace(self, quiet_since=time, parked_asked=False)

    def on_session_started(self, event: SessionStarted, settings: Settings) -> Transition:
        from journal.features.plans.feature import Plans
        from journal.features.plans.states.following_plan import FollowingPlan
        started = event.readings.of(Plans).started
        if started:
            return self.push(FollowingPlan(plan_id=started.plan_id, task_id=started.started_task, approved=True, logged_at=event.time))
        return self.changed(self.active(event.time))

    def on_task_started(self, event: TaskStarted, settings: Settings) -> Transition:
        from journal.features.plans.feature import Plans
        from journal.features.plans.states.following_plan import FollowingPlan
        from journal.features.tasks.states.working import Working
        started = event.readings.of(Plans).started
        if started and event.task_id in started.tasks:
            return self.push(FollowingPlan(plan_id=started.plan_id, task_id=event.task_id, approved=True, logged_at=event.time))
        return self.push(Working(task_id=event.task_id, logged_at=event.time))

    def on_plan_started(self, event: PlanStarted, settings: Settings) -> Transition:
        from journal.features.plans.states.following_plan import FollowingPlan
        return self.push(FollowingPlan(plan_id=event.plan_id, task_id=event.task_id, approved=True, logged_at=event.time))

    def on_prompt_submitted(self, event: PromptSubmitted, settings: Settings) -> Transition:
        return self.changed(self.active(event.time))

    def on_tool_starting(self, event: ToolStarting, settings: Settings) -> Transition:
        return self.changed(self.active(event.time))

    def on_stop(self, event: Stop, settings: Settings) -> Transition:
        from journal.features.plans.feature import Plans
        from journal.features.tasks.feature import Tasks
        tasks, plans = event.readings.of(Tasks), event.readings.of(Plans)
        if tasks.parked:
            return self.hold(Tasks.PARKED_TASKS_STILL_OPEN.create(tasks=tasks.parked_summary))
        if event.held_before:
            return self.unchanged()
        if tasks.broken_waits:
            return self.hold(Tasks.FIX_THE_BROKEN_WAIT.create(waits=tasks.broken_waits_summary))
        if plans.approved:
            return self.hold(Plans.APPROVED_UNSTARTED.create(n=plans.approved[0]))
        if settings.of(Tasks.AUTO) and tasks.next_open:
            return self.hold(Tasks.NEXT_TASK_HOLDS_THE_STOP.create(n=tasks.next_open.id, title=tasks.next_open.title))
        return self.unchanged()

    def on_ticked(self, event: Ticked, settings: Settings) -> Transition:
        from journal.features.tasks.feature import Tasks
        quiet = event.time - self.quiet_since
        tasks = event.readings.of(Tasks)
        if tasks.parked and quiet >= ASK_ABOUT_PARKED_AFTER and not self.parked_asked:
            return self.changed(replace(self, parked_asked=True), Tasks.PARKED_TASK_ASKED_ABOUT.create(n=tasks.parked[0], why=tasks.first_parked_why))
        if tasks.blocked_without_wait and quiet >= ASK_ABOUT_BLOCKED_AFTER:
            return self.unchanged(Tasks.BLOCKED_TASK_ASKED_ABOUT.create(tasks=tasks.blocked_without_wait_summary))
        if settings.of(Tasks.AUTO) and quiet >= CHECK_IN_AFTER:
            return self.unchanged(Tasks.CHECK_IN_AFTER_QUIET.create())
        return self.unchanged()
