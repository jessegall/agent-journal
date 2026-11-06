from dataclasses import dataclass

from core.base.model.environment_scoped import EnvironmentScoped
from core.base.model.view_model import ViewModel
from core.base.timestamp import Timestamp
from core.modules.memories.models.support.views import MEMORY_HOLDERS_SELECT


@dataclass(frozen=True, kw_only=True)
class MemoryHolder(EnvironmentScoped, ViewModel):
    """An agent other than a main agent that holds at least one memory, with how many are kept and how many are removed."""

    cli_name = "memory-holder"
    view = "memory_holders"
    key = "agent_id"
    select = MEMORY_HOLDERS_SELECT

    agent_id: int
    environment_id: int
    role: str
    given_name: str
    started_at: Timestamp
    ended_at: Timestamp | None
    active_memories: int
    removed_memories: int
