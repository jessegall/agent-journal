from dataclasses import dataclass

from core.base.timestamp import Timestamp
from core.modules.tasks.task import Task
from core.modules.tasks.task_log import TaskLog


@dataclass(frozen=True)
class CurrentTask:
    """The started task an agent holds, with its newest log line; writes and stops are counted from the later of
    the task's last change and that line."""

    task: Task
    last_log: TaskLog | None

    @property
    def name(self) -> str:
        return f"task {self.task.id}, {self.task.title}"

    @property
    def count_start(self) -> Timestamp:
        return max(stamp for stamp in (self.task.updated_at, self.last_log.created_at if self.last_log is not None else None) if stamp is not None)
