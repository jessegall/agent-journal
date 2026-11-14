from engine.model.assignable import Assignable
from core.modules.tasks.models.task import Task


class AssignRulesMode:
    """Whether a matching rule assigns its task or only records a dry run: it assigns once tasks are given only
    through the assignments, which is so while a task is an assignable row."""

    def is_assigning(self) -> bool:
        return issubclass(Task, Assignable)
