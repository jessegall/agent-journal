from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.processes.models.process import Process


@dataclass(frozen=True)
class StopTimedProcess(Command[Process]):
    """Stops a run whose timeout has passed."""

    process_id: int
