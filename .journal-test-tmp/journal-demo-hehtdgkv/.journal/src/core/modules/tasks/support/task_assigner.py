from typing import Protocol

from core.modules.tasks.models.task import Task


class TaskAssigner(Protocol):
    """What a suite names to hand out tasks: whether it hands them out by itself now, the task that goes before all
    others, and the task an agent with empty hands is given."""

    def is_automatic(self, environment_id: int) -> bool: ...

    def urgent(self, environment_id: int, excluded_id: int | None = None) -> Task | None: ...

    def following(self, environment_id: int, excluded_id: int | None = None) -> Task | None: ...
