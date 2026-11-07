from pathlib import Path

from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.environments.support.environment_rows import EnvironmentRows


class AgentFolders:
    """The folder an agent works in: a helper works where its parent works, and an agent with no parent works in
    its environment's folder."""

    def __init__(self, agents: AgentRows, environments: EnvironmentRows) -> None:
        self.agents, self.environments = agents, environments

    def resume_locations(self, agents: tuple[Agent, ...]) -> dict[int, tuple[bool, Path]]:
        return {agent.id: (self.has_folder(agent), self.resume_folder(agent)) for agent in agents}

    def has_folder(self, agent: Agent) -> bool:
        return True

    def resume_folder(self, agent: Agent) -> Path:
        return self.folder(agent)

    def folder(self, agent: Agent) -> Path:
        if agent.parent_id is None:
            return Path(self.environments.find(agent.environment_id).folder)
        return self.folder(self.agents.find(agent.parent_id))
