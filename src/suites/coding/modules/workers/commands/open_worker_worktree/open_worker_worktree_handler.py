from pathlib import Path

from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.listener.event_rows import EventRows
from core.base.repository.repository import Repository
from core.modules.environments.support.environment_rows import EnvironmentRows
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.commands.open_worker_worktree.open_worker_worktree import OpenWorkerWorktree
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.opened_worker import OpenedWorker

WORKTREES_FOLDER = Path(".journal") / "worktrees"


class OpenWorkerWorktreeHandler(Handler[OpenWorkerWorktree, OpenedWorker]):
    """Starts the worker's agent and saves its worktree row with the folder and branch git will cut."""

    command = OpenWorkerWorktree

    def __init__(self, bus: Bus, repository: Repository, rows: EventRows, environments: EnvironmentRows) -> None:
        self.bus, self.repository, self.rows, self.environments = bus, repository, rows, environments

    def handle(self, command: OpenWorkerWorktree, context: Context) -> OpenedWorker:
        task = self.rows.required(Task, command.task_id)
        environment = self.environments.find(task.environment_id)
        worker = self.bus.dispatch(command.start, context)
        name = f"worker-{worker.id}"
        worktree = self.repository.save(Worktree(session_agent_id=worker.id, task_id=task.id, creator_id=context.actor.id,
                                                 folder=str(Path(environment.folder) / WORKTREES_FOLDER / environment.name / name),
                                                 branch=f"journal/{environment.name}/{name}", base_branch=environment.branch), context)
        return OpenedWorker(worker, worktree)
