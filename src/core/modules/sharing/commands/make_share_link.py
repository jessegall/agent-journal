from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.sharing.commands.share_invitation import ShareInvitation


@dataclass(frozen=True)
class MakeShareLink(Command[ShareInvitation]):
    """Makes a read-only link to a document, a report or a plan, named as docs:12, reports:4 or plans:2."""

    target: str
