from engine.enums.actor_type import ActorType
from engine.change.changed import Changed
from engine.command.context import Context
from engine.guard.guard import Guard
from engine.errors.refusal import Refusal
from core.modules.approvals.models.standing_approval import StandingApproval


class StandingApprovalGuard(Guard[Changed[StandingApproval]]):
    """A standing yes is a person's: an agent neither makes nor removes one."""

    name = "approvals.person-stands"
    is_safety = True

    def check(self, event: Changed[StandingApproval], context: Context) -> None:
        if context.actor.type is ActorType.AGENT:
            raise Refusal("an agent cannot make or remove a standing yes")
