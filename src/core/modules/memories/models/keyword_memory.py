from dataclasses import dataclass

from core.base.model.view_model import ViewModel
from core.base.timestamp import Timestamp
from core.modules.memories.models.support.views import KEYWORD_MEMORIES_SELECT


@dataclass(frozen=True, kw_only=True)
class KeywordMemory(ViewModel):
    """A keyword of a active memory that is given by keyword."""

    cli_name = "memory-word"
    view = "keyword_memories"
    key = "keyword_id"
    select = KEYWORD_MEMORIES_SELECT

    keyword_id: int
    word: str
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
