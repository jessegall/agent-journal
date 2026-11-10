from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class PruneTempFolders(Command[int]):
    """Remove the temp folders the agent programs left for this project's ended sessions."""
