from collections.abc import Mapping
from dataclasses import dataclass

from core.modules.tasks.models.task import Task


@dataclass(frozen=True)
class RuleTask:
    """One task a change to a rule reaches, and where it goes."""

    task: Task
    target: str

    @property
    def line(self) -> str:
        return f"task {self.task.id}, {self.task.title}: {self.target}"

    def json(self) -> Mapping[str, object]:
        return {"task_id": self.task.id, "title": self.task.title, "target": self.target}
