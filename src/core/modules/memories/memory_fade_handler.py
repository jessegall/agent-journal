from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.agents.agent import Agent
from core.modules.agents.agent_role import AgentRole
from core.modules.memories.memory import Memory
from core.modules.memories.memory_fade import MemoryFade
from core.modules.memories.standing_memory_query import StandingMemoryQuery


class MemoryFadeHandler(Handler[MemoryFade, None]):
    """Lowers by one the weight of each standing memory of a fading type in the agent's own scope: the environment's
    memories for a main agent, its own for a helper; the project's never fade."""

    command = MemoryFade

    def __init__(self, standing: StandingMemoryQuery, queries: Queries, repository: Repository) -> None:
        self.standing, self.queries, self.repository = standing, queries, repository

    def handle(self, command: MemoryFade, context: Context) -> None:
        agent = self.queries.query(Agent).find(command.agent_id)
        scope = self.standing.environment_memories(agent.environment_id) if agent.role is AgentRole.MAIN else self.standing.agent_memories(agent.id)
        for row in scope.fading().all_rows():
            self.repository.save(self.queries.query(Memory).find(row.memory_id).faded(), context)
