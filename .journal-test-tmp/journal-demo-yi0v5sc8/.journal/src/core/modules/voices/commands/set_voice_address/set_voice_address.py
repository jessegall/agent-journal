from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class SetVoiceAddress(Command[str]):
    """Sets the title and the first name the voice calls the user by, those that are given, and answers what the
    agent calls the user now."""

    title: str | None
    name: str | None
