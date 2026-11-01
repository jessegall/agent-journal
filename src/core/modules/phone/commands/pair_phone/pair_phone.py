from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.phone.commands.support.phone_invitation import PhoneInvitation


@dataclass(frozen=True)
class PairPhone(Command[PhoneInvitation]):
    """Gives the calling person a short code that pairs one phone with the viewer as them."""
