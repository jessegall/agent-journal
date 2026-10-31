from core.base.actor_type import ActorType
from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.refusal import Refusal
from core.modules.memories.models.memory import Memory


class AgentWeightGuard(Guard):
    """An agent keeps or raises a memory's weight, never lowers it; a memory mostly true is corrected with edit."""

    name = "memories.agent-weight"
    event = "memory.update"

    def check(self, change: Change[Model]) -> None:
        old, new = change.old_row, change.new_row
        if change.actor.type is not ActorType.AGENT or not isinstance(old, Memory) or not isinstance(new, Memory) or new.weight >= old.weight:
            return
        raise Refusal(f"memory {old.id} weighs {old.weight}, and a weight is never lowered",
                      f"journal memory edit {old.id} --text '<the words anew>', or journal memory remove {old.id} --reason '<why>'")
