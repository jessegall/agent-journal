from engine.enums.actor_type import ActorType
from engine.change.changed import Changed
from engine.change.created import Created
from engine.change.deleted import Deleted
from engine.command.context import Context
from engine.guard.guard import Guard
from core.modules.sharing.models.lifecycles.share_link_lifecycle import ShareLinkLifecycle
from engine.errors.refusal import Refusal
from engine.errors.user_approval_refusal import UserApprovalRefusal
from core.modules.sharing.models.enums.share_link_state import ShareLinkState
from core.modules.sharing.models.share_link import ShareLink



class ShareLinkRowGuard(Guard[Changed[ShareLink]]):
    """Lets the person who made a link write it, an agent only ask for one that waits, and any person answer
    what an agent asked."""

    name = "sharing.share-link-rows"
    is_safety = True

    def check(self, event: Changed[ShareLink], context: Context) -> None:
        row, actor = event.row, context.actor
        if actor.type is ActorType.CORE:
            return
        is_new = isinstance(event, Created)
        if is_new and actor.type is ActorType.AGENT and row.state is ShareLinkState.WAITING:
            return
        if event.move in (ShareLinkLifecycle.accept, ShareLinkLifecycle.deny):
            if actor.type is ActorType.USER:
                return
            if actor.type is ActorType.AGENT:
                raise UserApprovalRefusal(f"Decide this share request {row.id}?", command=context.command)
        is_owner_change = is_new or isinstance(event, Deleted) or event.move is ShareLinkLifecycle.revoke
        is_creator_owner_change = is_owner_change and actor.type is ActorType.USER and actor.id == row.creator_id
        if is_creator_owner_change:
            return
        if actor.type is ActorType.AGENT and is_owner_change:
            raise UserApprovalRefusal(f"Change shared link {row.id}?", required_person_id=row.creator_id, command=context.command)
        raise Refusal("this shared link can only be changed by its owner")
