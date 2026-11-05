from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.sharing.commands.support.share_invitation import ShareInvitation


@dataclass(frozen=True)
class AcceptShareLink(Command[ShareInvitation]):
    """A person accepts the link an agent asked for, and gets its token."""

    link_id: int
