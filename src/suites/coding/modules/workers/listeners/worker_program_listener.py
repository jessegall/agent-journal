from engine.change.logged_event import LoggedEvent
from engine.listener.commit_listener import CommitListener
from engine.listener.event_rows import EventRows
from core.modules.agents.models.agent import Agent
from core.modules.environments.support.environment_rows import EnvironmentRows
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_command import WorkerCommand
from core.modules.agents.support.agent_launcher import AgentLauncher
from engine.change.moved import Moved
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle


class WorkerProgramListener(CommitListener[Moved[Worktree]]):
    """Starts fresh workers after their worktrees are cut; ended sessions resume through waiting jobs."""

    name = "workers.worker-program-request"
    moves = tuple([WorktreeLifecycle.cut])

    def __init__(self, launcher: AgentLauncher, rows: EventRows, worker_command: WorkerCommand, environments: EnvironmentRows, worktrees: WorktreeQuery) -> None:
        self.launcher, self.rows, self.worker_command, self.environments, self.worktrees = launcher, rows, worker_command, environments, worktrees

    def handle(self, event: Moved[Worktree], logged: LoggedEvent) -> None:
        worktree = event.row
        if not worktree.starts_program or not self.worktrees.is_first_worktree(worktree):
            return
        worker = self.rows.required(Agent, worktree.session_agent_id)
        environment = self.environments.find(worktree.environment_id)
        self.launcher.hand(worker, environment, self.worker_command.command(worker, worktree, environment, self.rows.required(Task, worktree.task_id)))
