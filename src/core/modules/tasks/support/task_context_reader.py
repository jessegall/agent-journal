from typing import Protocol, runtime_checkable

from engine.caller.caller import Caller
from core.modules.tasks.models.task import Task
from core.modules.tasks.support.task_conversation import TaskConversation


@runtime_checkable
class TaskContextReader(Protocol):
    """Reads a task's authorized conversation without selecting a request."""

    def overview(self, task: Task, caller: Caller) -> TaskConversation: ...
