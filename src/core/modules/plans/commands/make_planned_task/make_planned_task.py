from dataclasses import dataclass
from engine.command.command import Command

from engine.command.make_command import MakeCommand
from core.modules.tasks.models.task import Task
from core.modules.tasks.support.task_creation import TaskCreation


@dataclass(frozen=True)
class MakePlannedTask(Command[Task], TaskCreation):
    """Makes a task with initial tags and an optional phase in one transaction."""

    task: MakeCommand[Task]
    phase_id: int | None = None
    tags: tuple[str, ...] = ()
    confirmed_tags: bool = False
