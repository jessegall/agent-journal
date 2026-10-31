from dataclasses import dataclass

from core.base.model.view_model import ViewModel
from core.base.timestamp import Timestamp
from core.modules.memories.models.support.views import ACTIVE_MEMORIES_SELECT


@dataclass(frozen=True, kw_only=True)
class ActiveMemory(ViewModel):
    """An active memory above weight 0 with what its type says about giving it."""

    cli_name = "active-memory"
    view = "active_memories"
    key = "memory_id"
    select = ACTIVE_MEMORIES_SELECT

    memory_id: int
    environment_id: int | None
    agent_id: int | None
    type: str
    text: str
    weight: int
    due_at: Timestamp | None
    fades: bool
    start_delivery: bool
    mark_delivery: bool
    keyword_delivery: bool
    delivery_order: int
