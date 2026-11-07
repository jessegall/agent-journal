from collections.abc import Mapping
from dataclasses import dataclass

from core.modules.tasks.models.task_card import TaskCard


@dataclass(frozen=True)
class TaskGroup:
    """A page of tasks grouped by state or delegation."""

    state: str
    total: int
    rows: tuple[TaskCard, ...]

    def json(self) -> Mapping[str, object]:
        return {"state": self.state, "total": self.total, "rows": [{"id": task.id, "title": task.title, "state": task.state.value, "priority": task.priority, "automatic": task.automatic, "closed_at": task.closed_at, "delegated_to": task.delegated_to, "delegated_name": task.delegated_name} for task in self.rows]}
