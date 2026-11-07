from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class UpdateTunler(Command[str]):
    """Updates the tunler program to the newest its server offers."""

    lock = False
