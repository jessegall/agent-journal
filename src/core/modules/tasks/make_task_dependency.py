from dataclasses import dataclass
from core.base.command.make_command import MakeCommand
from core.modules.tasks.task_dependency import TaskDependency


@dataclass(frozen=True)
class MakeTaskDependency(MakeCommand[TaskDependency]):
    task_id: int
    dependency_id: int
