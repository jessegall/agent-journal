from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.scope.scopes import Scopes
from core.modules.memories.models.memory import Memory
from core.modules.memories.commands.fade_memories.fade_memories import FadeMemories
from core.modules.memories.queries.active_memory_query import ActiveMemoryQuery

FADING_REASON = "fading lowers the weight of every memory of the agent"


class FadeMemoriesHandler(Handler[FadeMemories, None]):
    """Lowers by one the weight of each active memory of the agent; the project's rules never fade."""

    command = FadeMemories

    def __init__(self, active: ActiveMemoryQuery, queries: Queries, repository: Repository, scopes: Scopes) -> None:
        self.active, self.queries, self.repository, self.scopes = active, queries, repository, scopes

    def handle(self, command: FadeMemories, context: Context) -> None:
        with self.scopes.opened(command.agent_id):
            memory_ids = [row.memory_id for row in self.active.every_row(FADING_REASON)]
            for memory in self.queries.query(Memory).find_many(memory_ids):
                self.repository.save_change(memory, memory.faded(context.timestamp, context.actor), context)
