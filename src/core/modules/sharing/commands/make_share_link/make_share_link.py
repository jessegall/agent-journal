from dataclasses import dataclass

from engine.command.command import Command
from core.modules.sharing.commands.support.share_invitation import ShareInvitation


@dataclass(frozen=True)
class MakeShareLink(Command[ShareInvitation]):
    """Makes a read-only link to a document, a report or a plan, named as docs:12, reports:4 or plans:2, or
    asks a user for one."""

    target: str
    ends: str = "7d"
    password: str | None = None
    comments: bool = False
