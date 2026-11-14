from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class ReportCompactionFaults(Command[None]):
    """Closes the compactions that can no longer go on and tells a user about each once."""
