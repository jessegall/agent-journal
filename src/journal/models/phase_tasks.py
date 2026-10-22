from dataclasses import dataclass

from journal.models.phase import Phase
from journal.models.task import Task
from journal.models.task_state import TaskState


@dataclass(frozen=True)
class PhaseTasks:
    """A phase of a plan with its number from 1 and its tasks in order, as the repository hands them to the plan."""

    number: int
    phase: Phase
    tasks: tuple[Task, ...]

    def is_finished(self) -> bool:
        return bool(self.tasks) and all(task.is_closed() for task in self.tasks)

    def has_open_work(self) -> bool:
        return any(not task.is_closed() for task in self.tasks)

    def has_work_started(self) -> bool:
        return any(task.state in (TaskState.STARTED, TaskState.FINISHED) for task in self.tasks)
