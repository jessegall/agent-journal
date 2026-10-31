from dataclasses import dataclass

from core.base.model.view_model import ViewModel
from core.base.timestamp import Timestamp
from core.modules.memories.giving_cause import GivingCause
from core.modules.memories.views import CONTEXT_MEMORIES_SELECT


@dataclass(frozen=True, kw_only=True)
class ContextMemory(ViewModel):
    """A giving of a memory to an agent since that agent's last compaction."""

    cli_name = "memory-in-context"
    view = "context_memories"
    key = "giving_id"
    select = CONTEXT_MEMORIES_SELECT

    giving_id: int
    agent_id: int
    memory_id: int
    cause: GivingCause
    giving_at: Timestamp
