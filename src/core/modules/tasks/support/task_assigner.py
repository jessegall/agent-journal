from typing import Protocol

from core.modules.tasks.models.task import Task


class TaskAssigner(Protocol):
    """What a suite names to hand out tasks: whether it hands them out by itself now, whether it gives an
    agent none for the moment, whether an agent may stop with tasks in hand, the task that goes before all
    others, and the task an agent with empty hands is given."""

    def is_automatic(self) -> bool: ...

    def holds_back_from(self, agent_id: int) -> bool: ...

    def may_stop_holding_tasks(self, agent_id: int) -> bool: ...

    def urgent(self, excluded_id: int | None = None) -> Task | None: ...

    def following(self, excluded_id: int | None = None) -> Task | None: ...
