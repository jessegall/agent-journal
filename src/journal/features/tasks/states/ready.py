from dataclasses import dataclass, replace

from journal.engine.base_state import BaseState
from journal.support.permission import Permission
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.stop import Stop
from journal.events.agent.prompt_submitted import PromptSubmitted
from journal.events.agent.session_started import SessionStarted
from journal.events.agent.ticked import Ticked
from journal.events.agent.tool_starting import ToolStarting
from journal.events.feature_data import FeatureData
from journal.events.rows.plan_started import PlanStarted
from journal.events.rows.setting_changed import SettingChanged
from journal.events.rows.task_started import TaskStarted
from journal.features.tasks.support.tasks_data import TasksData
from journal.engine.nudge import Nudge

SUSPENDED_REMINDER_DELAY_SECONDS = 60.0
BLOCKED_REMINDER_DELAY_SECONDS = 45 * 60.0
IDLE_CHECK_DELAY_SECONDS = 30 * 60.0


@dataclass(frozen=True)
class Ready(BaseState):
    """Nothing in hand: the bottom of the stack, never popped, and the builder's mode; the orchestrator's and the solo mode states extend it and are swapped in by the work mode setting at a session start, at the setting's change and on resume. A stop here is held by what is still open: a parked task, a blocked task whose check cannot run, an approved plan not started, and in auto mode any open task. The quiet is measured from the agent's last doing. Each mode state pushes its own states for a task and a plan."""

    name = "idle"
    title = "Idle"
    allows = frozenset({Permission.RUN_COMMANDS})
    quiet_since: float = 0.0
    parked_asked: bool = False

    def active(self, time: float) -> "Ready":
        return replace(self, quiet_since=time, parked_asked=False)

    def mode_state(self, settings: Settings) -> "Ready":
        from journal.features.workers.feature import Workers
        mode_state = Workers.MODE_STATES[str(settings.value(Workers.MODE))]
        return self if type(self) is mode_state else mode_state()

    def plan_state(self, **fields) -> BaseState:
        from journal.features.plans.states.following_plan import FollowingPlan
        return FollowingPlan(**fields)

    def working_state(self, **fields) -> BaseState:
        from journal.features.tasks.states.working import Working
        return Working(**fields)

    def on_session_started(self, event: SessionStarted, settings: Settings) -> Transition:
        from journal.features.plans.feature import Plans
        started = event.data.part(Plans).started
        mode_state = self.mode_state(settings).active(event.time)
        if started:
            return mode_state.push(mode_state.plan_state(plan_id=started.plan_id, task_id=started.started_task, approved=True, logged_at=event.time))
        return self.swap(mode_state)

    def on_setting_changed(self, event: SettingChanged, settings: Settings) -> Transition:
        from journal.features.workers.feature import Workers
        if event.setting != Workers.MODE.key:
            return self.none()
        return self.swap(self.mode_state(settings))

    def on_resume(self, data: FeatureData, settings: Settings) -> tuple[Nudge, ...] | Transition:
        mode_state = self.mode_state(settings)
        return () if mode_state is self else self.swap(mode_state)

    def on_task_started(self, event: TaskStarted, settings: Settings) -> Transition:
        from journal.features.plans.feature import Plans
        started = event.data.part(Plans).started
        if started and event.task_id in started.tasks:
            return self.push(self.plan_state(plan_id=started.plan_id, task_id=event.task_id, approved=True, logged_at=event.time))
        return self.push(self.working_state(task_id=event.task_id, logged_at=event.time))

    def on_plan_started(self, event: PlanStarted, settings: Settings) -> Transition:
        return self.push(self.plan_state(plan_id=event.plan_id, task_id=event.task_id, approved=True, logged_at=event.time))

    def on_prompt_submitted(self, event: PromptSubmitted, settings: Settings) -> Transition:
        return self.swap(self.active(event.time))

    def on_tool_starting(self, event: ToolStarting, settings: Settings) -> Transition:
        return self.swap(self.active(event.time))

    def on_stop(self, event: Stop, settings: Settings) -> Transition:
        from journal.features.plans.feature import Plans
        from journal.features.tasks.feature import Tasks
        tasks, plans = event.data.part(Tasks), event.data.part(Plans)
        if tasks.parked:
            return self.refuse(Tasks.SUSPENDED_TASKS.create(tasks=tasks.parked_summary))
        if event.held_before:
            return self.none()
        if tasks.broken_waits:
            return self.refuse(Tasks.BROKEN_WAIT.create(waits=tasks.broken_waits_summary))
        if plans.approved:
            return self.refuse(Plans.APPROVED_UNSTARTED.create(n=plans.approved[0]))
        return self.stop_answer(tasks, settings) if settings.value(Tasks.AUTO) else self.none()

    def stop_answer(self, tasks: TasksData, settings: Settings) -> Transition:
        from journal.features.tasks.feature import Tasks
        if tasks.next_open:
            return self.refuse(Tasks.NEXT_TASK.create(n=tasks.next_open.id, title=tasks.next_open.title))
        return self.none()

    def silent_nudges(self, tasks: TasksData) -> tuple[Nudge, ...]:
        from journal.features.tasks.feature import Tasks
        return (Tasks.IDLE_CHECK.create(),)

    def on_ticked(self, event: Ticked, settings: Settings) -> Transition:
        from journal.features.tasks.feature import Tasks
        silent = event.time - self.quiet_since
        tasks = event.data.part(Tasks)
        if tasks.parked and silent >= SUSPENDED_REMINDER_DELAY_SECONDS and not self.parked_asked:
            return self.swap(replace(self, parked_asked=True), Tasks.SUSPENDED_TASK_REMINDER.create(n=tasks.parked[0], why=tasks.first_parked_why))
        if tasks.blocked_without_wait and silent >= BLOCKED_REMINDER_DELAY_SECONDS:
            return self.none(Tasks.BLOCKED_TASK_REMINDER.create(tasks=tasks.blocked_without_wait_summary))
        if settings.value(Tasks.AUTO) and silent >= IDLE_CHECK_DELAY_SECONDS:
            return self.none(*self.silent_nudges(tasks))
        return self.none()
