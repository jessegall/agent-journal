from dataclasses import dataclass

from journal.engine.states.wait import Wait
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.rows.task_opened import TaskOpened
from journal.events.rows.task_reopened import TaskReopened


@dataclass(frozen=True)
class Impasse(Wait):
    """The agent said it is truly stuck. Nothing is said until it works again or the user speaks: its own next tool use, a word from the user, a task opened again or a new open task pops it."""

    name = "stuck"
    title = "Stuck"
    reason: str = ""

    def wait_description(self) -> tuple[str, str]:
        return self.reason, ""

    def on_task_reopened(self, event: TaskReopened, settings: Settings) -> Transition:
        return self.pop()

    def on_task_opened(self, event: TaskOpened, settings: Settings) -> Transition:
        from journal.features.tasks.feature import Tasks
        return self.pop(Tasks.TASK_OPENED.create(n=event.row_id, title=event.title)) if event.is_users() else self.none()
