from core.base.actor_type import ActorType
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.memories.models.enums.delivery_cause import DeliveryCause
from core.modules.memories.models.memory import Memory
from core.modules.memories.models.memory_delivery import MemoryDelivery
from core.modules.memories.commands.read_memory import ReadMemory


class ReadMemoryHandler(Handler[ReadMemory, Memory]):
    """Answers the memory, and keeps a delivery with cause read when an agent reads it, so it counts as in
    that agent's context until its next compaction."""

    command = ReadMemory

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: ReadMemory, context: Context) -> Memory:
        memory = self.queries.query(Memory).find(command.memory_id)
        if context.actor.type is ActorType.AGENT:
            self.repository.save(MemoryDelivery(memory_id=memory.id, agent_id=context.actor.id, creator_id=context.actor.id, cause=DeliveryCause.READ), context)
        return memory
