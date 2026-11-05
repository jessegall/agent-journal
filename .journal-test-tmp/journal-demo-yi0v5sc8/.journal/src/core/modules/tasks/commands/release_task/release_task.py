from dataclasses import dataclass
from core.base.command.move_command import MoveCommand
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle


@dataclass(frozen=True)
class ReleaseTask(MoveCommand[Task]):
    move = TaskLifecycle.release
    reason: str
