from collections.abc import Mapping
from dataclasses import dataclass, field
from types import MappingProxyType

from core.modules.assignments.support.assignment_reason import AssignmentReason
from core.modules.tasks.models.task_card import TaskCard


@dataclass(frozen=True)
class TaskGroup:
    """A page of tasks grouped by state or delegation, with why each was given to its assignee."""

    state: str
    total: int
    rows: tuple[TaskCard, ...]
    reasons: Mapping[int, AssignmentReason] = field(default_factory=lambda: MappingProxyType({}))

    def json(self) -> Mapping[str, object]:
        return {"state": self.state, "total": self.total, "rows": [{"id": task.id, "title": task.title, "state": task.state.value, "priority": task.priority, "automatic": task.automatic, "complexity": task.complexity, "tags": list(task.tags), "closed_at": task.closed_at, "assigned_actor_id": task.assigned_actor_id, "assigned_name": task.assigned_name, "assigned_type": task.assigned_type, "is_main_assignee": bool(task.is_main_assignee), "assignment_reason": self.reasons[task.id].text if task.id in self.reasons else None, "assignment_ref": self.reasons[task.id].ref if task.id in self.reasons else None} for task in self.rows]}
