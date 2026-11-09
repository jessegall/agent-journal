from core.base.change.logged_event import LoggedEvent
from core.base.change.moved import Moved
from core.base.listener.commit_listener import CommitListener
from core.base.listener.event_rows import EventRows
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_launcher import AgentLauncher
from core.modules.environments.support.environment_rows import EnvironmentRows
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_command import WorkerCommand


class UnstartedWorkerListener(CommitListener[Moved[Task]]):
    """Starts a worker that was made without starting, once one of its tasks opens."""

    name = "workers.unstarted-worker-start"
    moves = tuple([TaskLifecycle.unblock])
    disabled_scopes = [ActorScope]

    def __init__(self, launcher: AgentLauncher, rows: EventRows, worker_command: WorkerCommand, environments: EnvironmentRows, worktrees: WorktreeQuery) -> None:
        self.launcher, self.rows, self.worker_command, self.environments, self.worktrees = launcher, rows, worker_command, environments, worktrees

    def handle(self, event: Moved[Task], logged: LoggedEvent) -> None:
        task = event.row
        worktree = None if task.delegated_to is None else self.worktrees.worker_worktree(task.delegated_to)
        if worktree is None or worktree.starts_program:
            return
        worker = self.rows.required(Agent, worktree.session_agent_id)
        if worker.pid is None and worker.ended_at is None:
            environment = self.environments.find(worktree.environment_id)
            self.launcher.hand(worker, environment, self.worker_command.command(worker, worktree, environment, task))
