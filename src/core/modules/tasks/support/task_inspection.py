from collections.abc import Mapping
from dataclasses import dataclass

from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_log import TaskLog


@dataclass(frozen=True)
class TaskInspection:
    """What the task inspector draws: the task, the tasks it waits on and its log, oldest line first."""

    task: Task
    waits: tuple[Task, ...]
    logs: tuple[TaskLog, ...]

    def json(self) -> Mapping[str, object]:
        task = self.task
        return {"id": task.id, "title": task.title, "brief": task.brief, "state": task.state.value, "priority": task.priority.value, "reason": task.reason, "outcome": task.outcome,
                "holder_id": task.holder_id, "created_at": task.created_at.text, "updated_at": task.updated_at.text,
                "waits": [{"id": wait.id, "title": wait.title, "state": wait.state.value} for wait in self.waits],
                "logs": [{"id": log.id, "line": log.line, "created_at": log.created_at.text} for log in self.logs]}
