from dataclasses import dataclass
from engine.command.command import Command


@dataclass(frozen=True)
class DockedRuns:
    """The commands that dock an agent's runs now due."""

    commands: tuple[Command[object], ...]
