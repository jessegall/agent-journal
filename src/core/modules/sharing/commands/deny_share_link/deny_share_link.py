from dataclasses import dataclass

from engine.command.move_command import MoveCommand
from core.modules.sharing.models.lifecycles.share_link_lifecycle import ShareLinkLifecycle
from core.modules.sharing.models.share_link import ShareLink


@dataclass(frozen=True)
class DenyShareLink(MoveCommand[ShareLink]):
    move = ShareLinkLifecycle.deny
