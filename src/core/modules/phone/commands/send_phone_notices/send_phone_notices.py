from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class SendPhoneNotices(Command[int]):
    """Pushes one notice to each paired phone with a notice waiting, and gives how many phones it pushed."""
