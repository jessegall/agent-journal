from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class SaveStandardTemplates(Command[None]):
    """Brings the templates the journal ships to this version's words."""
