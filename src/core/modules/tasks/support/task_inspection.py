from collections.abc import Mapping
from dataclasses import dataclass

from core.modules.tasks.models.task import Task
from core.modules.tasks.support.task_inspection_json_record import TaskInspectionJsonRecord


@dataclass(frozen=True)
class TaskInspection:
    """What the task inspector draws: the task, the tasks it waits on, what will open it when it is blocked,
    and its log, oldest line first."""

    task: Task
    waits: tuple[Mapping[str, object], ...]
    logs: tuple[Mapping[str, object], ...]
    openers: tuple[str, ...] = ()

    def json(self) -> TaskInspectionJsonRecord:
        task = self.task
        return {"id": task.id, "title": task.title, "brief": task.brief, "state": task.state.value, "priority": task.priority, "reason": task.reason, "outcome": task.outcome,
                "holder_id": task.holder_id, "created_at": task.creation_timestamp().text, "updated_at": task.update_timestamp().text,
                "openers": list(self.openers), "waits": list(self.waits), "logs": list(self.logs)}
