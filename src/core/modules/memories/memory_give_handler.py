from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from core.modules.memories.memory_give import MemoryGive
from core.modules.memories.memory_delivery import MemoryDelivery


class MemoryGiveHandler(Handler[MemoryGive, None]):
    """Saves one delivery for each memory given to the agent."""

    command = MemoryGive

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, command: MemoryGive, context: Context) -> None:
        for memory_id in command.memory_ids:
            self.repository.save(MemoryDelivery(memory_id=memory_id, agent_id=command.agent_id, creator_id=context.actor.id, cause=command.cause), context)
