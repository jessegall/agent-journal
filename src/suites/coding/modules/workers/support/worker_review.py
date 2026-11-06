from collections.abc import Mapping
from dataclasses import dataclass

from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_log import TaskLog

NOTE_PREVIEW_COUNT = 8


@dataclass(frozen=True)
class WorkerReview:
    """What the main agent reads before it merges a worker: its tasks, what it logged on them, and the lines the
    journal has about them, by task."""

    tasks: tuple[Task, ...]
    logs: tuple[TaskLog, ...]
    flagged: Mapping[int, tuple[str, ...]]

    def task_logs(self, task: Task) -> tuple[TaskLog, ...]:
        return tuple(log for log in self.logs if log.task_id == task.id)

    def important_lines(self, task: Task) -> tuple[str, ...]:
        return (*(log.line for log in self.task_logs(task) if log.important), *self.flagged[task.id])

    def has_important_lines(self) -> bool:
        return any(self.important_lines(task) for task in self.tasks)

    def summary(self, task: Task) -> str:
        plain_lines = [" ".join(log.line.split()[:NOTE_PREVIEW_COUNT]) for log in self.task_logs(task) if not log.important]
        shown = [f"! {line}" for line in self.important_lines(task)] + [f"{len(plain_lines)} notes: {' | '.join(plain_lines)}".rstrip()]
        return f"task {task.id}: {task.title}\noutcome: {task.outcome}\n" + "\n".join(shown)

    def whole(self, task: Task) -> str:
        shown = [f"! {line}" for line in self.flagged[task.id]] + [f"! {log.line}" if log.important else log.line for log in self.task_logs(task)]
        return f"task {task.id}: {task.title}\noutcome: {task.outcome}\n" + "\n".join(shown)
