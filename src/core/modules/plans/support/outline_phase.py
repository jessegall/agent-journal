from collections.abc import Mapping
from dataclasses import dataclass

from core.modules.plans.support.outline_task import OutlineTask


@dataclass(frozen=True)
class OutlinePhase:
    """A phase as a plan's outline shows it, with its tasks in order."""

    id: int
    title: str
    goal: str
    tasks: tuple[OutlineTask, ...]
    checkpoint: bool = False

    def finished(self) -> bool:
        return all(task.is_closed() for task in self.tasks)

    def json(self) -> Mapping[str, object]:
        return {"id": self.id, "title": self.title, "goal": self.goal, "checkpoint": self.checkpoint, "tasks": [{"id": task.id, "title": task.title, "state": task.state, "priority": task.priority, "complexity": task.complexity, "tags": list(task.tags), "reason": task.reason, "automatic": task.automatic, "delegated_to": task.delegated_to, "main_delegate": task.main_delegate, "helper_id": task.helper_id, "helper_name": task.helper_name} for task in self.tasks]}
