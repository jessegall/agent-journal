from journal.config import Config
from journal.features.workers.support.worker_branch import WorkerBranch
from journal.features.workers.support.worker_worktree import WorkerWorktree
from journal.features.workers.support.workers_data import WorkersData
from journal.models.agent import Agent
from journal.repositories.workers import Workers
from journal.support.subagents import Subagents


class WorkersDataReader:
    """Reads the workers feature's part of the feature data for an agent."""

    def __init__(self, workers: Workers, subagents: Subagents, config: Config, branch: WorkerBranch) -> None:
        self.workers, self.subagents, self.config, self.branch = workers, subagents, config, branch

    def read(self, agent: Agent) -> WorkersData:
        waiting = self.workers.reports_waiting()
        return WorkersData(
            out=tuple(w.id for w in self.workers.active()),
            reports_waiting=tuple(w.id for w in waiting),
            reports_summary=", ".join(f"worker {w.id} ({w.name})" for w in waiting),
            subagents_running=self.subagents.running_earlier(agent.session),
            dispatches=tuple(self.subagents.rows(agent.session)),
            worktrees_root=(self.config.home / "worktrees").resolve(),
            worktrees=tuple(WorkerWorktree(self.branch.folder(w).name, w.id, w.name) for w in self.workers.scoped()),
        )
