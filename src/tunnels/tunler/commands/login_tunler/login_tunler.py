from dataclasses import dataclass, field

from core.base.command.command import Command
from tunnels.tunler.support.tunler_login import TunlerLogin


@dataclass(frozen=True)
class LoginTunler(Command[TunlerLogin]):
    """Logs this machine in to a tunler server, making the account when a master password comes with it."""

    lock = False

    host: str
    username: str
    password: str = field(repr=False)
    master: str | None = field(default=None, repr=False)
