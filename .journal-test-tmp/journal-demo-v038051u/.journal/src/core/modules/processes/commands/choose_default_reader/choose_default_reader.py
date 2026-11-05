from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.processes.models.reader import Reader


@dataclass(frozen=True)
class ChooseDefaultReader(Command[Reader]):
    """Makes the reader the default of its commands, in place of the one that was."""

    name: str
