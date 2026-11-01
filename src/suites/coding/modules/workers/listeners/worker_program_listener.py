from core.base.change.logged_event import LoggedEvent
from core.base.listener.commit_listener import CommitListener
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.environments.models.environment import Environment
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.worker_command import WorkerCommand
from suites.coding.modules.workers.support.worker_launcher import WorkerLauncher


class WorkerProgramListener(CommitListener):
    """A worktree just cut hands the running launcher its worker's program, folder and agent row to start."""

    name = "workers.worker-program-request"
    event = "worker_worktree.cut"

    def __init__(self, launcher: WorkerLauncher, queries: Queries, worker_command: WorkerCommand) -> None:
        self.launcher, self.queries, self.worker_command = launcher, queries, worker_command

    def handle(self, event: LoggedEvent) -> None:
        worktree = self.queries.query(Worktree).find(event.row_id)
        worker = self.queries.query(Agent).find(worktree.agent_id)
        environment = self.queries.query(Environment).find(worktree.environment_id)
        self.launcher.hand(worker, environment, self.worker_command.command(worker, worktree, environment, self.queries.query(Task).find(worktree.task_id)))
