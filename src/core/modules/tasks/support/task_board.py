from collections.abc import Mapping
from dataclasses import dataclass

from core.modules.tasks.models.task_card import TaskCard


@dataclass(frozen=True)
class TaskGroup:
    """One state's group of tasks on the board: how many there are, and the page of them that was asked for."""

    state: str
    total: int
    rows: tuple[TaskCard, ...]

    def json(self) -> Mapping[str, object]:
        return {"state": self.state, "total": self.total, "rows": [{"id": task.id, "title": task.title, "state": task.state.value, "priority": task.priority.value} for task in self.rows]}


@dataclass(frozen=True)
class TaskBoard:
    """What the tasks window draws: each state's group, holding only the fields of a row."""

    groups: tuple[TaskGroup, ...]

    def json(self) -> Mapping[str, object]:
        return {"groups": [group.json() for group in self.groups]}
