from dataclasses import dataclass

from engine.model.environment_scoped import EnvironmentScoped
from engine.model.view_model import ViewModel
from engine.time.timestamp import Timestamp
from core.modules.memories.models.support.views import MEMORY_HOLDERS_SELECT


@dataclass(frozen=True, kw_only=True)
class MemoryHolder(EnvironmentScoped, ViewModel):
    """An agent holding memories, with counts of active and removed memories."""

    cli_name = "memory-holder"
    view = "memory_holders"
    key = "agent_id"
    select = MEMORY_HOLDERS_SELECT
    shared_rows = True

    agent_id: int
    environment_id: int
    role: str
    given_name: str
    started_at: Timestamp
    ended_at: Timestamp | None
    active_memories: int
    removed_memories: int
