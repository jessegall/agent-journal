from engine.enums.actor_type import ActorType
from core.base.guard.guard import Guard
from engine.errors.refusal import Refusal
from core.modules.memories.models.memory import Memory
from core.base.change.updated import Updated
from core.base.command.context import Context


class AgentWeightGuard(Guard[Updated[Memory]]):
    """An agent keeps or raises a memory's weight, never lowers it; a memory mostly true is corrected with
    edit."""

    name = "memories.agent-weight"

    def check(self, event: Updated[Memory], context: Context) -> None:
        old, new = event.old_row, event.row
        if context.actor.type is not ActorType.AGENT or old is None or new.weight >= old.weight:
            return
        raise Refusal(f"memory {old.id} weighs {old.weight}, and a weight is never lowered",
                      f"journal memory edit {old.id} --text '<the words anew>', or journal memory remove {old.id} --reason '<why>'")
