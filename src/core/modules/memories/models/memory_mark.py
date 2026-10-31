from dataclasses import dataclass

from core.base.actor import Actor
from core.base.model.model import Model
from core.base.timestamp import Timestamp
from core.modules.memories.models.lifecycles.mark_lifecycle import MarkLifecycle
from core.modules.memories.models.enums.mark_state import MarkState


@dataclass(frozen=True, kw_only=True)
class MemoryMark(Model):
    """One context mark an agent passed: open until the agent weighs a memory or skips with a reason."""

    model_name = "memory_mark"
    cli_name = "memory-mark"
    lifecycle = MarkLifecycle

    agent_id: int
    creator_id: int
    percent: int
    state: MarkState = MarkState.OPEN
    reason: str = ""
    opened_at: Timestamp
    closed_at: Timestamp | None = None

    def weigh(self, timestamp: Timestamp, actor: Actor) -> "MemoryMark":
        return self.moved(MarkLifecycle.weigh, closed_at=timestamp)

    def skip(self, timestamp: Timestamp, actor: Actor, reason: str) -> "MemoryMark":
        return self.moved(MarkLifecycle.skip, reason=reason, closed_at=timestamp)
