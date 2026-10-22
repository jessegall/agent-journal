from dataclasses import dataclass, replace
from typing import Self

from journal.engine.base_state import BaseState
from journal.support.permission import Permission
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.rows.task_opened import TaskOpened
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
    """Nothing in hand: the bottom of the stack, never popped. A stop here is held by what is still open: a parked task, a blocked task whose check cannot run, and in auto mode any open task. A task this agent holds, once started, pushes Working; one another agent holds does not. The quiet is measured from the agent's last doing. A feature above tasks extends it under the same name, and work modes are states that extend it in turn."""

    name = "idle"
    title = "Idle"
    allows = frozenset({Permission.RUN_COMMANDS})
    silenced_at: float = 0.0
    suspension_reported: bool = False
    stop_round: int = 0

    def active(self, time: float) -> Self:
        return replace(self, silenced_at=time, suspension_reported=False)

    def working_state(self, **fields) -> BaseState:
        from journal.features.tasks.states.working import Working
        return Working(**fields)

    def on_session_started(self, event: SessionStarted, settings: Settings) -> Transition:
        return self.swap(self.active(event.time))

    def on_task_started(self, event: TaskStarted, settings: Settings) -> Transition:
        from journal.features.tasks.feature import Tasks
        if event.task_id not in event.data.part(Tasks).agent_tasks:
            return self.none()
        return self.push(self.working_state(task_id=event.task_id, logged_at=event.time))

    def on_prompt_submitted(self, event: PromptSubmitted, settings: Settings) -> Transition:
        return self.swap(replace(self.active(event.time), stop_round=0))

    def on_tool_starting(self, event: ToolStarting, settings: Settings) -> Transition:
        active = self.active(event.time)
        return self.swap(active if event.call.is_journal else replace(active, stop_round=0))

    def on_stop(self, event: Stop, settings: Settings) -> Transition:
        from journal.features.tasks.feature import Tasks
        tasks = event.data.part(Tasks)
        stop_nudges = self.stop_lines(event.data, settings)
        if self.stop_round < len(stop_nudges):
            return Transition.merged(self, [self.swap(replace(self, stop_round=self.stop_round + 1)), self.refuse(stop_nudges[self.stop_round])])
        if stop_nudges and (settings.value(Tasks.AUTO) or tasks.suspended):
            return self.refuse(Tasks.TASK_QUEUE.create(tasks=task_summary(tasks)))
        return self.none()

    def stop_lines(self, data: FeatureData, settings: Settings) -> tuple[Nudge, ...]:
        from journal.features.tasks.feature import Tasks
        tasks = data.part(Tasks)
        suspension_lines = (Tasks.SUSPENDED_TASKS.create(tasks=tasks.suspension_summary),) if tasks.suspended else ()
        wait_lines = (Tasks.BROKEN_WAIT.create(waits=tasks.broken_waits_summary),) if tasks.broken_waits else ()
        block_lines = (Tasks.BLOCKED_REVIEW.create(tasks=", ".join(map(str, tasks.blocked))),) if tasks.blocked and settings.value(Tasks.AUTO) else ()
        return (*suspension_lines, *wait_lines, *block_lines, *self.open_lines(data, settings))

    def open_lines(self, data: FeatureData, settings: Settings) -> tuple[Nudge, ...]:
        from journal.features.tasks.feature import Tasks
        tasks = data.part(Tasks)
        if not settings.value(Tasks.AUTO) or not tasks.next_open:
            return ()
        return (Tasks.NEXT_TASK.create(n=tasks.next_open.id, title=tasks.next_open.title),)

    def silent_nudges(self, tasks: TasksData) -> tuple[Nudge, ...]:
        from journal.features.tasks.feature import Tasks
        return (Tasks.IDLE_CHECK.create(),)

    def on_task_opened(self, event: TaskOpened, settings: Settings) -> Transition:
        from journal.features.tasks.feature import Tasks
        return self.none(Tasks.TASK_OPENED.create(n=event.row_id, title=event.title)) if event.is_users() else self.none()

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


def task_summary(tasks: TasksData) -> str:
    return "; ".join(part for part in (f"parked {tasks.suspension_summary}" if tasks.suspended else "", f"open {', '.join(map(str, tasks.open_ids))}" if tasks.open_ids else "", f"blocked {', '.join(map(str, tasks.blocked))}" if tasks.blocked else "") if part)
