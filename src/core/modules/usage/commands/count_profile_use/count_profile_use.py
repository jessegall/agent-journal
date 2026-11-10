from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class CountProfileUse(Command[None]):
    """A subagent was started under this profile."""

    profile: str
