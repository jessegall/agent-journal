from collections.abc import Mapping, Sequence
from dataclasses import dataclass

from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_log import TaskLog
from suites.coding.modules.workers.support.worker_test_failures import WorkerTestFailures

NOTE_LENGTH = 8
REVIEWED_STATES = (TaskState.TESTING, TaskState.COMPLETED)


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
        plain_lines = [" ".join(log.line.split()[:NOTE_LENGTH]) for log in self.task_logs(task) if not log.important]
        shown = [f"! {line}" for line in self.important_lines(task)] + [f"{len(plain_lines)} notes: {' | '.join(plain_lines)}".rstrip()]
        return f"task {task.id}: {task.title}\noutcome: {task.outcome}\n" + "\n".join(shown)

    def whole(self, task: Task) -> str:
        shown = [f"! {line}" for line in self.flagged[task.id]] + [f"! {log.line}" if log.important else log.line for log in self.task_logs(task)]
        return f"task {task.id}: {task.title}\noutcome: {task.outcome}\n" + "\n".join(shown)


class WorkerLogLines:
    """Reads what the main agent reviews of a worker before it merges."""

    def __init__(self, queries: Queries, failures: WorkerTestFailures) -> None:
        self.queries, self.failures = queries, failures

    def review(self, worker_id: int) -> WorkerReview:
        tasks = tuple(self.queries.query(Task).filter(delegated_to=worker_id).matching(Among("state", REVIEWED_STATES)).oldest().all_rows())
        task_ids = [task.id for task in tasks]
        rows = self.queries.query(TaskLog).filter(creator_id=worker_id).matching(Among("task_id", task_ids)).oldest().all_rows()
        return WorkerReview(tasks, tuple(rows), self.failures.flagged_lines(task_ids))
