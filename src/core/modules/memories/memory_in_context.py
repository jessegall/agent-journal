from dataclasses import dataclass

from core.base.model.view_model import ViewModel
from core.base.timestamp import Timestamp
from core.modules.memories.giving_cause import GivingCause
from core.modules.memories.views import MEMORIES_IN_CONTEXT_SELECT


@dataclass(frozen=True, kw_only=True)
class MemoryInContext(ViewModel):
    """A giving of a memory to an agent since that agent's last compaction."""

    cli_name = "memory-in-context"
    view = "memories_in_context"
    key = "giving_id"
    select = MEMORIES_IN_CONTEXT_SELECT

    giving_id: int
    agent_id: int
    memory_id: int
    cause: GivingCause
    given_at: Timestamp
