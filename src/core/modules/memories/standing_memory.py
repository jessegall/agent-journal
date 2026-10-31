from dataclasses import dataclass

from core.base.model.view_model import ViewModel
from core.base.timestamp import Timestamp
from core.modules.memories.views import STANDING_MEMORIES_SELECT


@dataclass(frozen=True, kw_only=True)
class StandingMemory(ViewModel):
    """An active memory above weight 0 with what its type says about giving it."""

    cli_name = "standing-memory"
    view = "standing_memories"
    key = "memory_id"
    select = STANDING_MEMORIES_SELECT

    memory_id: int
    environment_id: int | None
    agent_id: int | None
    type: str
    text: str
    weight: int
    due_at: Timestamp | None
    fades: bool
    given_at_start: bool
    given_at_mark: bool
    given_by_keyword: bool
    giving_order: int
