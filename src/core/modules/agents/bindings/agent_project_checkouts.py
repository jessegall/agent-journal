from pathlib import Path

from core.base.agent_checkouts import AgentCheckouts
from core.base.checkout import Checkout
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.environments.models.environment import Environment


class AgentProjectCheckouts(AgentCheckouts):
    """Every agent works in the folder of its environment, until a suite binds a kind of agent that has its own."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def checkout(self, agent_id: int) -> Checkout:
        environment = self.environment(self.queries.query(Agent).find(agent_id))
        return Checkout.project_checkout(Path(environment.folder), environment.branch)

    def environment(self, agent: Agent) -> Environment:
        return self.queries.query(Environment).find(agent.environment_id)
