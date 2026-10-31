from dataclasses import dataclass

from core.base.model.model import Model
from core.modules.memories.giving_cause import GivingCause


@dataclass(frozen=True, kw_only=True)
class MemoryGiving(Model):
    """One giving of a memory to an agent, and why."""

    model_name = "memory_giving"
    cli_name = "memory-giving"

    memory_id: int
    agent_id: int
    creator_id: int
    cause: GivingCause
