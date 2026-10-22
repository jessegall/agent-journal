from journal.config import Config
from journal.features.workers.support.worker_branch import WorkerBranch
from journal.features.workers.support.worker_worktree import WorkerWorktree
from journal.features.workers.support.workers_data import WorkersData
from journal.models.agent import Agent
from journal.repositories.tasks import Tasks
from journal.repositories.worker_todos import WorkerTodos
from journal.repositories.workers import Workers
from journal.repositories.subagents import Subagents


class WorkersDataReader:
    """Reads the workers feature's part of the feature data for an agent."""

    def __init__(self, workers: Workers, subagents: Subagents, config: Config, branch: WorkerBranch, tasks: Tasks, todos: WorkerTodos) -> None:
        self.workers, self.subagents, self.config, self.branch, self.tasks, self.todos = workers, subagents, config, branch, tasks, todos

    def read(self, agent: Agent) -> WorkersData:
        rows, subagents = self.workers.scoped(), self.subagents.session_subagents(agent.session)
        return WorkersData(
            dispatched_workers=tuple(w for w in rows if w.is_running()),
            idle_workers=tuple(w for w in rows if w.is_idle()),
            active_subagents=sum(1 for s in subagents if s.is_running()),
            subagents=tuple(subagents),
            worktrees_root=(self.config.home / "worktrees").resolve(),
            worktrees=tuple(WorkerWorktree(self.branch.folder(w).name, w.row_id, w.name) for w in rows),
            session_workers=tuple(self.workers.session_worker(agent.session)),
            todos=tuple(item for task_id in self.tasks.holder_task_ids(self.workers.agent_holder(agent)) for item in self.todos.task_items(self.tasks.find(task_id))),
        )
