from journal.config import Config
from journal.features.workers.support.worker_branch import WorkerBranch
from journal.features.workers.support.worker_worktree import WorkerWorktree
from journal.features.workers.support.workers_standing import WorkersStanding
from journal.models.agent import Agent
from journal.repositories.workers import Workers
from journal.support.subagents import Subagents


class WorkersStandingReader:
    """Reads the workers feature's part of the Standing for an agent."""

    def __init__(self, workers: Workers, subagents: Subagents, config: Config, branch: WorkerBranch) -> None:
        self.workers, self.subagents, self.config, self.branch = workers, subagents, config, branch

    def read(self, agent: Agent) -> WorkersStanding:
        waiting = self.workers.reports_waiting()
        return WorkersStanding(
            out=tuple(w.id for w in self.workers.out()),
            reports_waiting=tuple(w.id for w in waiting),
            reports_waiting_named=", ".join(f"worker {w.id} ({w.name})" for w in waiting),
            subagents_running=self.subagents.running_before_the_newest(agent.session),
            dispatches=tuple(self.subagents.rows(agent.session)),
            worktrees_root=(self.config.home / "worktrees").resolve(),
            worktrees=tuple(WorkerWorktree(self.branch.folder(w).name, w.id, w.name) for w in self.workers.in_()),
        )
