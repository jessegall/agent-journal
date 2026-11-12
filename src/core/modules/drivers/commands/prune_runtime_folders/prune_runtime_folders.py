from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class PruneRuntimeFolders(Command[int]):
    """Removes the file scan state of folders no scan has touched for days, and the terminal logs of agents that
    ended days ago."""
