from dataclasses import dataclass

from engine.command.command import Command
from core.modules.processes.models.process import Process


@dataclass(frozen=True)
class RequestOutputCheck(Command[Process]):
    """Asks the agent that started a run to read its output and decide, as the run printed nothing for the given
    seconds while it still uses processor time."""

    process_id: int
    seconds: int
