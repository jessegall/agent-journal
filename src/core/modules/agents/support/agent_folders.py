from pathlib import Path

from engine.enums.helper_role import HelperRole
from core.base.journal_home import JournalHome
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.environments.support.environment_rows import EnvironmentRows

START_FOLDERS_SUFFIX = "-journal-helpers"


class AgentFolders:
    """The folder an agent works in: a helper with a start folder of its own works there, any other helper where its
    parent works, and an agent with no parent in its environment's folder."""

    def __init__(self, agents: AgentRows, environments: EnvironmentRows, home: JournalHome) -> None:
        self.agents, self.environments, self.home = agents, environments, home

    def resume_locations(self, agents: tuple[Agent, ...]) -> dict[int, tuple[bool, Path]]:
        return {agent.id: (self.has_folder(agent), self.resume_folder(agent)) for agent in agents}

    def has_folder(self, agent: Agent) -> bool:
        return True

    def resume_folder(self, agent: Agent) -> Path:
        return self.folder(agent)

    def start_folder(self, agent: Agent) -> Path:
        project = self.home.project_folder.resolve()
        return project.parent / f".{project.name}{START_FOLDERS_SUFFIX}" / str(agent.id)

    def folder(self, agent: Agent) -> Path:
        if agent.role == HelperRole.HELPER and self.start_folder(agent).is_dir():
            return self.start_folder(agent)
        return self.checkout_folder(agent)

    def checkout_folder(self, agent: Agent) -> Path:
        if agent.parent_id is None:
            return Path(self.environments.find(agent.environment_id).folder)
        return self.folder(self.agents.find(agent.parent_id))
