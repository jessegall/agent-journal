from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.processes.models.process import Process


@dataclass(frozen=True)
class TimeoutProcess(Command[Process]):
    """Stops a run whose timeout has passed."""

    process_id: int
