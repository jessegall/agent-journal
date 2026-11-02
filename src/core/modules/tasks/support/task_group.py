from collections.abc import Mapping
from dataclasses import dataclass

from core.modules.tasks.models.task_card import TaskCard


@dataclass(frozen=True)
class TaskGroup:
    """One state's group of tasks on the board, or the group delegated to workers: how many there are, and the page of them that was asked for.
    """

    state: str
    total: int
    rows: tuple[TaskCard, ...]

    def json(self) -> Mapping[str, object]:
        return {"state": self.state, "total": self.total, "rows": [{"id": task.id, "title": task.title, "state": task.state.value, "priority": task.priority, "closed_at": task.closed_at, "delegated_to": task.delegated_to} for task in self.rows]}
