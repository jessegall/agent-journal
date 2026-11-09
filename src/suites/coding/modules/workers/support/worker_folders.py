from pathlib import Path

from suites.coding.support.coding_helper_role import CodingHelperRole
from core.modules.agents.models.agent import Agent
from core.base.journal_home import JournalHome
from core.base.query.conditions.among import Among
from core.modules.agents.support.agent_folders import AgentFolders
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.environments.support.environment_rows import EnvironmentRows
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery


class WorkerFolders(AgentFolders):
    """A worker works in its worktree, so a helper of a worker works there too."""

    def __init__(self, agents: AgentRows, environments: EnvironmentRows, worktrees: WorktreeQuery, home: JournalHome) -> None:
        super().__init__(agents, environments, home)
        self.worktrees = worktrees

    def resume_locations(self, agents: tuple[Agent, ...]) -> dict[int, tuple[bool, Path]]:
        parent_ids = list({agent.parent_id for agent in agents if agent.parent_id is not None})
        parents = {parent.id: parent for parent in self.agents.find_many(parent_ids)}
        environments = {row.id: row for row in self.environments.find_many(list({agent.environment_id for agent in agents}))}
        ids = tuple({agent.id for agent in agents} | set(parents))
        worktrees = self.worktrees.with_removed().matching(Among("session_agent_id", ids)).oldest().all_rows()
        latest = {worktree.session_agent_id: worktree for worktree in worktrees}
        active = {worktree.session_agent_id: worktree for worktree in worktrees if worktree.removed_at is None}
        locations: dict[int, tuple[bool, Path]] = {}
        for agent in agents:
            parent = parents.get(agent.parent_id) if agent.parent_id is not None else None
            available = parent is None or parent.role != CodingHelperRole.WORKER or parent.id in active
            worktree = latest.get(agent.id)
            if self.start_folder(agent).is_dir():
                folder = self.start_folder(agent)
            elif worktree is not None:
                folder = Path(worktree.folder)
            elif parent is not None and parent.id in active:
                folder = Path(active[parent.id].folder)
            else:
                folder = Path(environments[agent.environment_id].folder)
            locations[agent.id] = (available, folder)
        return locations

    def has_folder(self, agent: Agent) -> bool:
        parent = self.agents.find(agent.parent_id) if agent.parent_id is not None else None
        return parent is None or parent.role != CodingHelperRole.WORKER or self.worktrees.worker_worktree(parent.id) is not None

    def folder(self, agent: Agent) -> Path:
        worktree = self.worktrees.worker_worktree(agent.id)
        return Path(worktree.folder) if worktree is not None else super().folder(agent)

    def resume_folder(self, agent: Agent) -> Path:
        worktree = self.worktrees.newest_worktree(agent.id)
        return Path(worktree.folder) if worktree is not None else super().resume_folder(agent)
