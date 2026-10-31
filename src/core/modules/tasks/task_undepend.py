from dataclasses import dataclass
from core.base.command.command import Command


@dataclass(frozen=True)
class TaskUndepend(Command[None]):
    """Removes the dependency of one task on another."""

    task_id: int
    dependency_id: int
