from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.memories.delivery_cause import DeliveryCause


@dataclass(frozen=True)
class MemoryGive(Command[None]):
    """Keeps that memories were given to an agent, and why."""

    agent_id: int
    memory_ids: tuple[int, ...]
    cause: DeliveryCause
