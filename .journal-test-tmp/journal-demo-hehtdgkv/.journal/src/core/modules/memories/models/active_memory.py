from dataclasses import dataclass

from core.base.model.view_model import ViewModel
from core.modules.memories.models.support.views import ACTIVE_MEMORIES_SELECT


@dataclass(frozen=True, kw_only=True)
class ActiveMemory(ViewModel):
    """An active memory above weight 0."""

    cli_name = "active-memory"
    view = "active_memories"
    key = "memory_id"
    select = ACTIVE_MEMORIES_SELECT

    memory_id: int
    environment_id: int
    agent_id: int | None
    text: str
    weight: int
