from dataclasses import dataclass

from engine.command.command import Command
from core.modules.processes.models.process import Process


@dataclass(frozen=True)
class RunGrantedCommand(Command[Process]):
    """Runs a line a helper was granted."""

    command_parts: tuple[str, ...]
