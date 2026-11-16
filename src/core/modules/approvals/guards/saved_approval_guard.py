from engine.enums.actor_type import ActorType
from engine.event.changed import Changed
from engine.command.context import Context
from engine.guard.guard import Guard
from engine.errors.refusal import Refusal
from core.modules.approvals.models.saved_approval import SavedApproval


class SavedApprovalGuard(Guard[Changed[SavedApproval]]):
    """A saved yes is a user's: an agent neither makes nor removes one."""

    name = "approvals.person-stands"
    is_safety = True

    def check(self, event: Changed[SavedApproval], context: Context) -> None:
        if context.actor.type is ActorType.AGENT:
            raise Refusal("an agent cannot make or remove a saved yes")
