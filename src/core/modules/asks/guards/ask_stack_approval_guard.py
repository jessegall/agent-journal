from engine.command.context import Context
from engine.command.errors.user_approval_refusal import UserApprovalRefusal
from engine.enums.actor_type import ActorType
from engine.event.changed import Changed
from engine.event.deleted import Deleted
from engine.guard.guard import Guard
from core.modules.asks.models.ask_stack import AskStack


class AskStackApprovalGuard(Guard[Changed[AskStack]]):
    """An agent's question stack waits for the user: an agent can save one only as waiting, and cannot put one into
    force, since a stack decides which helpers start and what they cost."""

    name = "asks.agent-stack"
    is_safety = True

    def check(self, event: Changed[AskStack], context: Context) -> None:
        if isinstance(event, Deleted) or context.actor.type is not ActorType.AGENT:
            return
        old, new = event.old_row, event.row
        becomes_active = not new.requires_approval and new.ended_at is None and (old is None or old.requires_approval)
        if becomes_active:
            raise UserApprovalRefusal(f"Use the question stack {new.id} for {new.topic}?", ("ask-stack", "approve", str(new.id)))
