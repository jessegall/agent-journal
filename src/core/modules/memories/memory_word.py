from dataclasses import dataclass

from core.base.model.view_model import ViewModel
from core.base.timestamp import Timestamp
from core.modules.memories.views import MEMORY_WORDS_SELECT


@dataclass(frozen=True, kw_only=True)
class MemoryWord(ViewModel):
    """A keyword of a standing memory that is given by keyword."""

    cli_name = "memory-word"
    view = "memory_words"
    key = "keyword_id"
    select = MEMORY_WORDS_SELECT

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
    given_at_start: bool
    given_at_mark: bool
    given_by_keyword: bool
    giving_order: int
