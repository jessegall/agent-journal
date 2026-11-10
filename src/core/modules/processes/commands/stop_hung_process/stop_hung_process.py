from dataclasses import dataclass

from engine.command.command import Command
from core.modules.processes.models.process import Process


@dataclass(frozen=True)
class StopHungProcess(Command[Process]):
    """Stops a run that printed nothing and used no processor time for the given seconds, keeping its output."""

    process_id: int
    seconds: int
