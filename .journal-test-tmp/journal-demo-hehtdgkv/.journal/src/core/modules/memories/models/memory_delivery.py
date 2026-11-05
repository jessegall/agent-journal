from dataclasses import dataclass

from core.base.model.model import Model
from core.modules.memories.models.enums.delivery_cause import DeliveryCause


@dataclass(frozen=True, kw_only=True)
class MemoryDelivery(Model):
    """One delivery of a memory to an agent, and why."""

    model_name = "memory_delivery"
    cli_name = "memory-delivery"

    memory_id: int
    agent_id: int
    creator_id: int
    cause: DeliveryCause
