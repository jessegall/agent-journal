from dataclasses import dataclass

from core.base.command.move_command import MoveCommand
from core.modules.sharing.models.lifecycles.share_link_lifecycle import ShareLinkLifecycle
from core.modules.sharing.models.share_link import ShareLink


@dataclass(frozen=True)
class RevokeShareLink(MoveCommand[ShareLink]):
    move = ShareLinkLifecycle.revoke
