from dataclasses import dataclass

from core.base.command.command import Command
from core.base.command.make_command import MakeCommand
from core.tasks.task_dependency import TaskDependency


@dataclass(frozen=True)
class TaskDependencyMake(MakeCommand[TaskDependency]):
    task_id: int
    dependency_id: int


@dataclass(frozen=True)
class TaskUndepend(Command[None]):
    """Removes the dependency of one task on another."""

    task_id: int
    dependency_id: int
