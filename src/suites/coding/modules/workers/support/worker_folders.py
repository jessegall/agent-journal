from pathlib import Path

from suites.coding.support.coding_agent_role import CodingAgentRole as AgentRole
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_folders import AgentFolders
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.environments.support.environment_rows import EnvironmentRows
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery


class WorkerFolders(AgentFolders):
    """A worker works in its worktree, so a helper of a worker works there too."""

    def __init__(self, agents: AgentRows, environments: EnvironmentRows, worktrees: WorktreeQuery) -> None:
        super().__init__(agents, environments)
        self.worktrees = worktrees

    def has_folder(self, agent: Agent) -> bool:
        parent = self.agents.find(agent.parent_id) if agent.parent_id is not None else None
        return parent is None or parent.role != AgentRole.WORKER or self.worktrees.worker_worktree(parent.id) is not None

    def folder(self, agent: Agent) -> Path:
        worktree = self.worktrees.worker_worktree(agent.id)
        return Path(worktree.folder) if worktree is not None else super().folder(agent)

    def resume_folder(self, agent: Agent) -> Path:
        worktree = self.worktrees.newest_worktree(agent.id)
        return Path(worktree.folder) if worktree is not None else super().resume_folder(agent)
