from dataclasses import dataclass

from engine.command.command import Command
from engine.time.duration import Duration
from core.modules.processes.models.process import Process


@dataclass(frozen=True)
class SetOutputTimeout(Command[Process]):
    """Sets a run's duration limit from its start."""

    process_id: int
    duration: Duration
