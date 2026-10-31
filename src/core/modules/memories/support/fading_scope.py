from core.base.agent_role import AgentRole
from core.base.query.conditions.among import Among
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.memories.models.enums.memory_state import MemoryState
from core.modules.memories.models.memory import Memory
from core.modules.memories.models.memory_type import MemoryType


class FadingScope:
    """The memories a compaction fades for an agent, at any weight: the environment's memories for a main agent,
    its own for a helper, of the types that fade."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def memories(self, agent_id: int) -> list[Memory]:
        agent = self.queries.query(Agent).find(agent_id)
        fading = [type_row.name for type_row in self.queries.query(MemoryType).filter(fades=True).all_rows()]
        scope = self.queries.query(Memory).filter(state=MemoryState.ACTIVE).matching(Among("type", fading))
        if agent.role is AgentRole.MAIN:
            return list(scope.filter(environment_id=agent.environment_id).matching(IsNull("agent_id")).all_rows())
        return list(scope.filter(agent_id=agent.id).all_rows())
