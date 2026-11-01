from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.processes.models.reader import Reader


@dataclass(frozen=True)
class AddReader(Command[Reader]):
    """Adds a reader, or changes the fields given of the one that has the name; a field left out stays as it
    was."""

    name: str
    commands: str = ""
    lines: str = ""
    script: str = ""
    progress: str = ""
    finished: str = ""
    failed: str = ""
    summary: str = ""
    topic: str = ""
    title: str = ""
