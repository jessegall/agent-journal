from collections.abc import Mapping
from core.modules.tasks.support.task_group import TaskGroup
from dataclasses import dataclass

from core.modules.assignments.support.assignment_reason import AssignmentReason


@dataclass(frozen=True)
class TaskBoard:
    """What the tasks window draws: each state's group, holding only the fields of a row, and why each task shown
    was given to its assignee."""

    groups: tuple[TaskGroup, ...]
    reasons: Mapping[int, AssignmentReason]

    def json(self) -> Mapping[str, object]:
        return {"groups": [group.json(self.reasons) for group in self.groups]}
