from dataclasses import dataclass

from core.base.model.view_model import ViewModel
from core.base.timestamp import Timestamp
from core.modules.memories.delivery_cause import DeliveryCause
from core.modules.memories.views import CONTEXT_MEMORIES_SELECT


@dataclass(frozen=True, kw_only=True)
class ContextMemory(ViewModel):
    """A delivery of a memory to an agent since that agent's last compaction."""

    cli_name = "memory-in-context"
    view = "context_memories"
    key = "delivery_id"
    select = CONTEXT_MEMORIES_SELECT

    delivery_id: int
    agent_id: int
    memory_id: int
    cause: DeliveryCause
    delivered_at: Timestamp
