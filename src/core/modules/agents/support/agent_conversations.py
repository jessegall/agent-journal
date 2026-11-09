from core.base.provider.providers import Providers
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_folders import AgentFolders


class AgentConversations:
    """Says whether the session on an agent's row has a conversation its program can resume there."""

    def __init__(self, providers: Providers, folders: AgentFolders) -> None:
        self.providers, self.folders = providers, folders

    def exists(self, agent: Agent) -> bool:
        return self.providers.provider(agent.program).session_matches_folder(self.folders.folder(agent), agent.session)
