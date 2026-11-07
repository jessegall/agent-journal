from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.sharing.models.share_link import ShareLink


@dataclass(frozen=True)
class CountShareView(Command[ShareLink]):
    """A visitor opened the link with this token digest."""

    token_digest: str
