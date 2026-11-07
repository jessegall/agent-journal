from dataclasses import dataclass

from core.base.model.agent_scoped import AgentScoped
from core.base.model.environment_scoped import EnvironmentScoped
from core.base.model.view_model import ViewModel
from core.modules.memories.models.support.views import KEYWORD_MEMORIES_SELECT


@dataclass(frozen=True, kw_only=True)
class KeywordMemory(AgentScoped, EnvironmentScoped, ViewModel):
    """A keyword of an active memory."""

    cli_name = "memory-word"
    view = "keyword_memories"
    key = "keyword_id"
    select = KEYWORD_MEMORIES_SELECT

    keyword_id: int
    word: str
    memory_id: int
    environment_id: int
    agent_id: int | None
    text: str
    weight: int
