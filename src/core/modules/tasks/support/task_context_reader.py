from collections.abc import Mapping, Sequence
from typing import Protocol

from core.base.caller.caller import Caller
from core.modules.tasks.models.task import Task


class TaskConversation(Protocol):
    """The bounded conversation supplied with a task overview."""

    def lines(self) -> Sequence[str]: ...

    def json(self) -> Mapping[str, object]: ...


class TaskContextReader(Protocol):
    """Reads a task's authorized conversation without selecting a request."""

    def overview(self, task: Task, caller: Caller) -> TaskConversation: ...
