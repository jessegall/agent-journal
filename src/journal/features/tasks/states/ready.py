from dataclasses import dataclass, replace
from typing import Self

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
from journal.events.rows.task_started import TaskStarted
from journal.features.tasks.support.tasks_data import TasksData
from journal.engine.nudge import Nudge

SUSPENDED_REMINDER_DELAY_SECONDS = 60.0
BLOCKED_REMINDER_DELAY_SECONDS = 45 * 60.0
IDLE_CHECK_DELAY_SECONDS = 30 * 60.0


@dataclass(frozen=True)
class Ready(BaseState):
    """Nothing in hand: the bottom of the stack, never popped. A stop here is held by what is still open: a parked task, a blocked task whose check cannot run, and in auto mode any open task. The quiet is measured from the agent's last doing. A feature above tasks extends it under the same name, and work modes are states that extend it in turn."""

    name = "idle"
    title = "Idle"
    allows = frozenset({Permission.RUN_COMMANDS})
    silenced_at: float = 0.0
    suspension_reported: bool = False

    def active(self, time: float) -> Self:
        return replace(self, silenced_at=time, suspension_reported=False)

    def working_state(self, **fields) -> BaseState:
        from journal.features.tasks.states.working import Working
        return Working(**fields)

    def on_session_started(self, event: SessionStarted, settings: Settings) -> Transition:
        return self.swap(self.active(event.time))

    def on_task_started(self, event: TaskStarted, settings: Settings) -> Transition:
        return self.push(self.working_state(task_id=event.task_id, logged_at=event.time))

    def on_prompt_submitted(self, event: PromptSubmitted, settings: Settings) -> Transition:
        return self.swap(self.active(event.time))

    def on_tool_starting(self, event: ToolStarting, settings: Settings) -> Transition:
        return self.swap(self.active(event.time))

    def on_stop(self, event: Stop, settings: Settings) -> Transition:
        from journal.features.tasks.feature import Tasks
        tasks = event.data.part(Tasks)
        if tasks.suspended:
            return self.refuse(Tasks.SUSPENDED_TASKS.create(tasks=tasks.suspension_summary))
        if event.prior_refusal:
            return self.none()
        if tasks.broken_waits:
            return self.refuse(Tasks.BROKEN_WAIT.create(waits=tasks.broken_waits_summary))
        return self.open_work_answer(event.data, settings)

    def open_work_answer(self, data: FeatureData, settings: Settings) -> Transition:
        from journal.features.tasks.feature import Tasks
        return self.stop_answer(data.part(Tasks), settings) if settings.value(Tasks.AUTO) else self.none()

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
        silent = event.time - self.silenced_at
        tasks = event.data.part(Tasks)
        if tasks.suspended and silent >= SUSPENDED_REMINDER_DELAY_SECONDS and not self.suspension_reported:
            return self.swap(replace(self, suspension_reported=True), Tasks.SUSPENDED_TASK_REMINDER.create(n=tasks.suspended[0], why=tasks.first_suspension_reason))
        if tasks.blocked_without_wait and silent >= BLOCKED_REMINDER_DELAY_SECONDS:
            return self.none(Tasks.BLOCKED_TASK_REMINDER.create(tasks=tasks.blocked_without_wait_summary))
        if settings.value(Tasks.AUTO) and silent >= IDLE_CHECK_DELAY_SECONDS:
            return self.none(*self.silent_nudges(tasks))
        return self.none()
