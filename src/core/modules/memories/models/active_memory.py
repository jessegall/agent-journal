from dataclasses import dataclass

from engine.model.agent_scoped import AgentScoped
from engine.model.environment_scoped import EnvironmentScoped
from engine.model.view_model import ViewModel
from core.modules.memories.models.support.views import ACTIVE_MEMORIES_SELECT


@dataclass(frozen=True, kw_only=True)
class ActiveMemory(AgentScoped, EnvironmentScoped, ViewModel):
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
