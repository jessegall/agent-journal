from abc import ABC, abstractmethod
from collections.abc import Sequence


class TaskAssigner[Row](ABC):
    """The base of what a suite names to hand out tasks: whether it hands them out by itself now, whether it
    gives an agent none for the moment, whether an agent may stop with tasks in hand, the task that goes
    before all others, the task an agent with empty hands is given, the unfinished tasks that are an agent's
    own and the tasks that wait blocked. Row is the task model of the module that holds tasks."""

    @abstractmethod
    def is_automatic(self) -> bool: ...

    @abstractmethod
    def exceeds_context_limit(self, agent_id: int) -> bool: ...

    @abstractmethod
    def allows_stop_with_tasks(self, agent_id: int) -> bool: ...

    @abstractmethod
    def urgent(self, excluded_id: int | None = None) -> Row | None: ...

    @abstractmethod
    def following(self, agent_id: int, excluded_id: int | None = None) -> Row | None: ...

    @abstractmethod
    def own_tasks(self, agent_ids: Sequence[int]) -> dict[int, tuple[int, ...]]: ...

    @abstractmethod
    def blocked_tasks(self) -> tuple[int, ...]: ...
