from dataclasses import dataclass

from core.base.command.make_command import MakeCommand
from core.modules.tasks.models.task import Task


@dataclass(frozen=True)
class MakeWorkerJob(MakeCommand[Task]):
    title: str
    brief: str
