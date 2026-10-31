from core.base.actor_type import ActorType
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.memories.giving_cause import GivingCause
from core.modules.memories.memory import Memory
from core.modules.memories.memory_giving import MemoryGiving
from core.modules.memories.memory_read import MemoryRead


class MemoryReadHandler(Handler[MemoryRead, Memory]):
    """Answers the memory, and keeps a giving with cause read when an agent reads it, so it counts as in that
    agent's context until its next compaction."""

    command = MemoryRead

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: MemoryRead, context: Context) -> Memory:
        memory = self.queries.query(Memory).find(command.memory_id)
        if context.actor.type is ActorType.AGENT:
            self.repository.save(MemoryGiving(memory_id=memory.id, agent_id=context.actor.id, creator_id=context.actor.id, cause=GivingCause.READ), context)
        return memory
