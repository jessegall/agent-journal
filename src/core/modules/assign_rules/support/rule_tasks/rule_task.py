from collections.abc import Mapping
from dataclasses import dataclass

from core.modules.assign_rules.models.support.task_facts import TaskFacts
from core.modules.tasks.models.task import Task


@dataclass(frozen=True)
class RuleTask:
    """One task a change to a rule reaches, the facts the rules judged it on, and where it goes."""

    task: Task
    facts: TaskFacts
    target: str

    @property
    def line(self) -> str:
        return f"task {self.task.id}, {self.task.title}: {self.target}"

    def json(self) -> Mapping[str, object]:
        return {"task_id": self.task.id, "title": self.task.title, "target": self.target}
