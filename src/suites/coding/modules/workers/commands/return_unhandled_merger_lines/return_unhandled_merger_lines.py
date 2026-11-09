from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class ReturnUnhandledMergerLines(Command[None]):
    """Makes the lines an ended merger read and did nothing about unread again."""
