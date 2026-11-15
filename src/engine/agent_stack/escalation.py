from dataclasses import dataclass

from engine.agent_stack.state_key import StateKey
from engine.enums.escalation_type import EscalationType
from engine.enums.responder import Responder


@dataclass(frozen=True)
class Escalation:
    """An open escalation of an agent: which count reached its limit, who was asked, and the holds and
    Working stacked states it defers."""

    escalation_id: int
    escalation_type: EscalationType
    responder: Responder
    block_ids: tuple[int, ...]
    work_keys: tuple[StateKey, ...]
    refusal_count: int

    def defers(self, block_id: int | None) -> bool:
        return block_id is not None and block_id in self.block_ids

    # a Working stacked state whose stop answer it names rests the agent's next stop; a new constraint still refuses
    # by the stacked state's generation, unique to its work, since the stored row keeps the generation alone
    def defers_work(self, key: StateKey) -> bool:
        return key.generation in {work_key.generation for work_key in self.work_keys}
