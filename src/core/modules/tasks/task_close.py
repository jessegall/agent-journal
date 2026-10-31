from dataclasses import dataclass
from core.base.command.move_command import MoveCommand
from core.modules.tasks.task import Task
from core.modules.tasks.task_lifecycle import TaskLifecycle


@dataclass(frozen=True)
class TaskClose(MoveCommand[Task]):
    move = TaskLifecycle.close
    outcome: str
