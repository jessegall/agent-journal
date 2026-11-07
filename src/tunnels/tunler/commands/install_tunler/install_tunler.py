from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class InstallTunler(Command[str]):
    """Installs tunler on this machine from a tunler server."""

    lock = False

    server: str
