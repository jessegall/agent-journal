from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class PruneRunFolders(Command[int]):
    """Remove the folders of runs that ended a while ago and kept no output."""
