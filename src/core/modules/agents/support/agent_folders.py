from pathlib import Path

from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.environments.models.environment import Environment


class AgentFolders:
    """The folder an agent works in: a helper works where its parent works, and an agent with no parent works in
    its environment's folder."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def folder(self, agent: Agent) -> Path:
        if agent.parent_id is None:
            return Path(self.queries.query(Environment).find(agent.environment_id).folder)
        return self.folder(self.queries.query(Agent).find(agent.parent_id))
