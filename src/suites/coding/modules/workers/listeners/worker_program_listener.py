from core.base.change.logged_event import LoggedEvent
from core.base.listener.commit_listener import CommitListener
from core.base.listener.event_rows import EventRows
from core.modules.agents.models.agent import Agent
from core.modules.environments.support.environment_rows import EnvironmentRows
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.worker_command import WorkerCommand
from core.modules.agents.support.agent_launcher import AgentLauncher
from core.base.change.moved import Moved
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle


class WorkerProgramListener(CommitListener[Moved[Worktree]]):
    """A worktree just cut hands the running launcher its worker's program, folder and agent row to start."""

    name = "workers.worker-program-request"
    moves = tuple([WorktreeLifecycle.cut])

    def __init__(self, launcher: AgentLauncher, rows: EventRows, worker_command: WorkerCommand, environments: EnvironmentRows) -> None:
        self.launcher, self.rows, self.worker_command, self.environments = launcher, rows, worker_command, environments

    def handle(self, event: Moved[Worktree], logged: LoggedEvent) -> None:
        worktree = event.row
        worker = self.rows.required(Agent, worktree.agent_id)
        environment = self.environments.find(worktree.environment_id)
        self.launcher.hand(worker, environment, self.worker_command.command(worker, worktree, environment, self.rows.required(Task, worktree.task_id)))
