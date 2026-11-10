from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class UpdateTunler(Command[str]):
    """Updates the tunler program to the newest its server offers."""

    lock = False
