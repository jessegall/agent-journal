from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class ApproveDifference(Command[int]):
    """A person approves one kind of difference between the old and the new answers as intended."""

    key: str
    reason: str
