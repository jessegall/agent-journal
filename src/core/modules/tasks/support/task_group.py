from collections.abc import Mapping
from dataclasses import dataclass

from core.modules.assignments.support.assignment_reason import AssignmentReason
from core.modules.tasks.models.task_card import TaskCard


@dataclass(frozen=True)
class TaskGroup:
    """A page of tasks grouped by state or delegation."""

    state: str
    total: int
    rows: tuple[TaskCard, ...]

    def json(self, reasons: Mapping[int, AssignmentReason]) -> Mapping[str, object]:
        return {"state": self.state, "total": self.total, "rows": [{"id": task.id, "title": task.title, "state": task.state.value, "priority": task.priority, "automatic": task.automatic, "complexity": task.complexity, "tags": list(task.tags), "closed_at": task.closed_at, "assigned_actor_id": task.assigned_actor_id, "assigned_name": task.assigned_name, "assigned_type": task.assigned_type, "is_main_assignee": bool(task.is_main_assignee), "assignment_reason": reasons[task.id].text if task.id in reasons else None, "assignment_ref": reasons[task.id].ref if task.id in reasons else None} for task in self.rows]}
