from core.base.actor_type import ActorType
from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.refusal import Refusal
from core.modules.sharing.models.share_link import ShareLink

OWNER_EVENTS = ("share_link.create", "share_link.revoke", "share_link.delete")


class ShareLinkRowGuard(Guard):
    """Lets only the person who made a link write it, make, revoke or delete, so no agent shares a row."""

    name = "sharing.share-link-rows"
    event = "share_link.*"

    def check(self, change: Change[Model]) -> None:
        row = change.row
        actor = change.context.actor
        if not isinstance(row, ShareLink) or actor.type is ActorType.CORE:
            return
        if change.event in OWNER_EVENTS and actor.type is ActorType.USER and actor.id == row.creator_id:
            return
        raise Refusal("only the person who made a link revokes it", "revoke it from the Share window")
