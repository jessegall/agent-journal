from dataclasses import dataclass

from engine.command.command import Command
from core.modules.tasks.models.task import Task


@dataclass(frozen=True)
class StartNextWorkerTask(Command[Task]):
    """A worker starts the next task it may start, beside the tasks it has started. Nothing is committed,
    judged or tested."""
