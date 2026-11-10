from dataclasses import dataclass
from engine.command.command import Command


@dataclass(frozen=True)
class RemoveTaskDependency(Command[None]):
    """Removes the dependency of one task on another."""

    task_id: int
    dependency_id: int
