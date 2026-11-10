from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class LogoutTunler(Command[str]):
    """Logs this machine out of tunler and stops the tunnel it keeps open."""

    lock = False
