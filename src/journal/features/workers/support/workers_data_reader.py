from journal.config import Config
from journal.features.workers.support.worker_branch import WorkerBranch
from journal.features.workers.support.worker_worktree import WorkerWorktree
from journal.features.workers.support.workers_data import WorkersData
from journal.models.agent import Agent
from journal.repositories.workers import Workers
from journal.repositories.subagents import Subagents


class WorkersDataReader:
    """Reads the workers feature's part of the feature data for an agent."""

    def __init__(self, workers: Workers, subagents: Subagents, config: Config, branch: WorkerBranch) -> None:
        self.workers, self.subagents, self.config, self.branch = workers, subagents, config, branch

    def read(self, agent: Agent) -> WorkersData:
        rows, subagents = self.workers.scoped(), self.subagents.session_subagents(agent.session)
        return WorkersData(
            dispatched_workers=tuple(w for w in rows if w.is_running()),
            idle_workers=tuple(w for w in rows if w.is_idle()),
            active_subagents=sum(1 for s in subagents if s.is_running()),
            subagents=tuple(subagents),
            worktrees_root=(self.config.home / "worktrees").resolve(),
            worktrees=tuple(WorkerWorktree(self.branch.folder(w).name, w.id, w.name) for w in rows),
        )
