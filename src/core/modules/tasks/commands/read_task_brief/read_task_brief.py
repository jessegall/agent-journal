from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.tasks.support.task_brief import TaskBrief


@dataclass(frozen=True)
class ReadTaskBrief(Command[TaskBrief]):
    """Reads a task's title, brief and comments; an agent that reads it has read the task in its current
    context window."""

    lock = False

    task_id: int
