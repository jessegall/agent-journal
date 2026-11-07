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
from suites.coding.modules.workers.support.worker_places import WorkerPlaces

WORKTREES_FOLDER = Path(".journal") / "worktrees"


class OpenWorkerWorktreeHandler(Handler[OpenWorkerWorktree, OpenedWorker]):
    """Checks the limits and starts the worker's agent in one write, so two dispatches cannot both pass, and saves
    its worktree row with the folder and branch git will cut."""

    command = OpenWorkerWorktree

    def __init__(self, bus: Bus, repository: Repository, rows: EventRows, environments: EnvironmentRows, places: WorkerPlaces) -> None:
        self.bus, self.repository, self.rows, self.environments, self.places = bus, repository, rows, environments, places

    def handle(self, command: OpenWorkerWorktree, context: Context) -> OpenedWorker:
        task = self.rows.required(Task, command.task_id)
        environment = self.environments.find(task.environment_id)
        self.places.check_new_place()
        worker = self.bus.dispatch(command.start, context)
        name = f"worker-{worker.id}"
        worktree = self.repository.save(Worktree(session_agent_id=worker.id, task_id=task.id, creator_id=context.actor.id,
                                                 folder=str(Path(environment.folder) / WORKTREES_FOLDER / environment.name / name),
                                                 branch=f"journal/{environment.name}/{name}", base_branch=environment.branch, new_agent_reason=command.new_agent_reason, route_reason=command.route_reason), context)
        return OpenedWorker(worker, worktree)
