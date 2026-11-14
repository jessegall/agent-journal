from collections.abc import Mapping
from core.modules.tasks.support.task_group import TaskGroup
from dataclasses import dataclass



@dataclass(frozen=True)
class TaskBoard:
    """What the tasks window draws: each state's group, holding only the fields of a row."""

    groups: tuple[TaskGroup, ...]

    def json(self) -> Mapping[str, object]:
        return {"groups": [group.json() for group in self.groups]}
