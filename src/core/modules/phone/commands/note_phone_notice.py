from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class NotePhoneNotice(Command[int]):
    """Marks that a notice waits on every paired phone that subscribed, and gives how many phones it marked."""
