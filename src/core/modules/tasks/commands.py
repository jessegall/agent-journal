from dataclasses import dataclass

from core.base.command.move_command import MoveCommand
from core.modules.tasks.task import Task, TaskLifecycle


@dataclass(frozen=True)
class TaskStart(MoveCommand[Task]):
    move = TaskLifecycle.start


@dataclass(frozen=True)
class TaskBlock(MoveCommand[Task]):
    move = TaskLifecycle.block
    reason: str


@dataclass(frozen=True)
class TaskClose(MoveCommand[Task]):
    move = TaskLifecycle.close
    outcome: str


@dataclass(frozen=True)
class TaskCancel(MoveCommand[Task]):
    move = TaskLifecycle.cancel
    reason: str
