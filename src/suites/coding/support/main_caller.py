from core.base.command.context import Context
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from suites.coding.support.coding_agent_role import CodingAgentRole as AgentRole


class MainCaller:
    """Tells whether a command comes from a main agent, as opposed to a person, a worker or a helper."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def is_main(self, context: Context) -> bool:
        return self.queries.query(Agent).filter(id=context.actor.id, role=AgentRole.MAIN).exists()
