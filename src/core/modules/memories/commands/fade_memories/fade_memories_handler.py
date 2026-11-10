from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.query.queries import Queries
from core.base.repository.repository import Repository
from core.base.scope.scopes import Scopes
from core.modules.memories.models.memory import Memory
from core.modules.memories.commands.fade_memories.fade_memories import FadeMemories
from core.modules.memories.queries.active_memory_query import ActiveMemoryQuery


class FadeMemoriesHandler(Handler[FadeMemories, None]):
    """Lowers by one the weight of each active memory of the agent; the project's rules never fade."""

    command = FadeMemories

    def __init__(self, active: ActiveMemoryQuery, queries: Queries, repository: Repository, scopes: Scopes) -> None:
        self.active, self.queries, self.repository, self.scopes = active, queries, repository, scopes

    def handle(self, command: FadeMemories, context: Context) -> None:
        with self.scopes.opened(command.agent_id):
            memory_ids = [row.memory_id for row in self.active.all_rows()]
            for memory in self.queries.query(Memory).find_many(memory_ids):
                self.repository.save_change(memory, memory.faded(context.timestamp, context.actor), context)
