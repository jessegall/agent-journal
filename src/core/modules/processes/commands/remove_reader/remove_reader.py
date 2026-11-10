from dataclasses import dataclass

from engine.command.command import Command
from core.modules.processes.models.reader import Reader


@dataclass(frozen=True)
class RemoveReader(Command[Reader]):
    """Removes the reader of that name."""

    name: str
