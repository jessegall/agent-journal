from dataclasses import dataclass

from engine.command.command import Command
from core.modules.processes.models.process import Process


@dataclass(frozen=True)
class StopProcesses(Command[tuple[Process, ...]]):
    """Stops several processes at once, each as one stop would."""

    row_ids: tuple[int, ...]
