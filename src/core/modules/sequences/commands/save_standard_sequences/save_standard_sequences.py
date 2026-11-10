from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class SaveStandardSequences(Command[None]):
    """Brings the sequences the journal ships to this version's words."""
