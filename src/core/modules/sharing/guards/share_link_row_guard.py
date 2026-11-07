from core.base.actor_type import ActorType
from core.base.change.changed import Changed
from core.base.change.created import Created
from core.base.change.deleted import Deleted
from core.base.command.context import Context
from core.base.guard.guard import Guard
from core.modules.sharing.models.lifecycles.share_link_lifecycle import ShareLinkLifecycle
from core.base.refusal import Refusal
from core.base.user_approval import UserApproval
from core.modules.sharing.models.enums.share_link_state import ShareLinkState
from core.modules.sharing.models.share_link import ShareLink



class ShareLinkRowGuard(Guard[Changed[ShareLink]]):
    """Lets the person who made a link write it, an agent only ask for one that waits, and any person answer
    what an agent asked."""

    name = "sharing.share-link-rows"

    def check(self, event: Changed[ShareLink], context: Context) -> None:
        row, actor = event.row, context.actor
        if actor.type is ActorType.CORE:
            return
        is_new = isinstance(event, Created)
        if is_new and actor.type is ActorType.AGENT and row.state is ShareLinkState.WAITING:
            return
        if event.move in (ShareLinkLifecycle.accept, ShareLinkLifecycle.deny) and actor.type is ActorType.USER:
            return
        is_owner_change = is_new or isinstance(event, Deleted) or event.move is ShareLinkLifecycle.revoke
        if is_owner_change and actor.type is ActorType.USER and actor.id == row.creator_id:
            return
        if actor.type is ActorType.AGENT and is_owner_change:
            raise UserApproval(f"Change shared link {row.id}?", required_person_id=row.creator_id)
        raise Refusal("this shared link can only be changed by its owner")
