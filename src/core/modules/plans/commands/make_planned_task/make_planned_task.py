from dataclasses import dataclass

from core.base.command.command import Command
from core.base.command.make_command import MakeCommand
from core.modules.tasks.models.task import Task


@dataclass(frozen=True)
class MakePlannedTask(Command[Task]):
    """Makes a task and places it at the end of a phase in one transaction."""

    task: MakeCommand[Task]
    phase_id: int
