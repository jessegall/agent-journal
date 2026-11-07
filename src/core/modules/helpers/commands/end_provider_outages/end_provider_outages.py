from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class EndProviderOutages(Command[None]):
    """Ends every current outage of a program without removing its history."""

    program: str
