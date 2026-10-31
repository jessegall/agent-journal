from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.base.agent_role import AgentRole
from core.modules.memories.models.memory import Memory
from core.modules.memories.commands.fade_memories import FadeMemories
from core.modules.memories.queries.active_memory_query import ActiveMemoryQuery


class FadeMemoriesHandler(Handler[FadeMemories, None]):
    """Lowers by one the weight of each active memory of a fading type in the agent's own scope: the
    environment's memories for a main agent, its own for a helper; the project's never fade."""

    command = FadeMemories

    def __init__(self, active: ActiveMemoryQuery, queries: Queries, repository: Repository) -> None:
        self.active, self.queries, self.repository = active, queries, repository

    def handle(self, command: FadeMemories, context: Context) -> None:
        agent = self.queries.query(Agent).find(command.agent_id)
        scope = self.active.environment_memories(agent.environment_id) if agent.role is AgentRole.MAIN else self.active.agent_memories(agent.id)
        for row in scope.fading().all_rows():
            self.repository.save(self.queries.query(Memory).find(row.memory_id).faded(), context)
