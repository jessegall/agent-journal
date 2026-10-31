from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from core.modules.memories.commands.give_memories import GiveMemories
from core.modules.memories.models.memory_delivery import MemoryDelivery


class GiveMemoriesHandler(Handler[GiveMemories, None]):
    """Saves one delivery for each memory given to the agent."""

    command = GiveMemories

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, command: GiveMemories, context: Context) -> None:
        for memory_id in command.memory_ids:
            self.repository.save(MemoryDelivery(memory_id=memory_id, agent_id=command.agent_id, creator_id=context.actor.id, cause=command.cause), context)
