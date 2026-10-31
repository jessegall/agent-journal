from dataclasses import dataclass
from core.base.command.make_command import MakeCommand
from core.modules.tasks.task_log import TaskLog


@dataclass(frozen=True)
class TaskLogMake(MakeCommand[TaskLog]):
    task_id: int
    line: str
