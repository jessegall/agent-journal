from collections.abc import Mapping
from dataclasses import dataclass

from core.modules.tasks.models.task_card import TaskCard
from core.modules.tasks.models.task_edge import TaskEdge


@dataclass(frozen=True)
class TaskGraph:
    """The unfinished tasks of an environment that wait on another or are waited on, and those waits."""

    tasks: tuple[TaskCard, ...]
    edges: tuple[TaskEdge, ...]

    def json(self) -> Mapping[str, object]:
        return {"tasks": [task.json() for task in self.tasks], "edges": [[edge.task_id, edge.blocker_id] for edge in self.edges]}
