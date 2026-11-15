from dataclasses import dataclass

from engine.agent_stack.need_key import NeedKey
from engine.enums.escalation_type import EscalationType
from engine.enums.responder import Responder


@dataclass(frozen=True)
class Escalation:
    """An open escalation of an agent: which count reached its limit, who was asked, and the holds and
    Working frames it defers."""

    escalation_id: int
    escalation_type: EscalationType
    responder: Responder
    block_ids: tuple[int, ...]
    work_keys: tuple[NeedKey, ...]
    refusal_count: int

    def defers(self, block_id: int | None) -> bool:
        return block_id is not None and block_id in self.block_ids
