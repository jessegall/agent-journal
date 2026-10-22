from dataclasses import dataclass

from journal.engine.states.wait import Wait
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.rows.task_reopened import TaskReopened


@dataclass(frozen=True)
class Impasse(Wait):
    """The agent said it is truly stuck. Nothing is said until it works again or the user speaks: its own next tool use, a word from the user or a task opened again pops it."""

    name = "stuck"
    title = "Stuck"
    reason: str = ""

    def wait_description(self) -> tuple[str, str]:
        return self.reason, ""

    def on_task_reopened(self, event: TaskReopened, settings: Settings) -> Transition:
        return self.pop()
