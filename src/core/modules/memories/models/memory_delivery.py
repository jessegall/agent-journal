from engine.model.prunable import Prunable
from dataclasses import dataclass

from engine.model.model import Model
from core.modules.memories.models.enums.delivery_cause import DeliveryCause


@dataclass(frozen=True, kw_only=True)
class MemoryDelivery(Prunable, Model):
    """One delivery of a memory to an agent, and why."""

    kept_rows = 10000

    model_name = "memory_delivery"
    cli_name = "memory-delivery"

    memory_id: int
    session_agent_id: int
    creator_id: int
    cause: DeliveryCause
