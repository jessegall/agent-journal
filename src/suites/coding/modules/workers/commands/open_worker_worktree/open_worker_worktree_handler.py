from pathlib import Path

from suites.coding.support.worktree_checkouts import WORKTREES_FOLDER

from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.rows.event_rows import EventRows
from engine.repository.repository import Repository
from engine.errors.refusal import Refusal
from core.modules.environments.support.environment_rows import EnvironmentRows
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.commands.open_worker_worktree.open_worker_worktree import OpenWorkerWorktree
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.opened_worker import OpenedWorker
from suites.coding.modules.workers.support.worker_places import WorkerPlaces
from suites.coding.modules.workers.support.worker_opening_rows import WorkerOpeningRows
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from core.modules.environments.models.environment import Environment
from engine.file.file_access import FileAccess

NAME_TRIES = 100



class OpenWorkerWorktreeHandler(Handler[OpenWorkerWorktree, OpenedWorker]):
    """Checks limits and records the worker and its worktree, removing the worker if a worktree guard refuses. A
    worktree name an older worker with the same id left, as a folder or a branch, gets a count after it."""

    command = OpenWorkerWorktree

    def __init__(self, bus: Bus, repository: Repository, rows: EventRows, environments: EnvironmentRows, places: WorkerPlaces, opening: WorkerOpeningRows,
                 git: WorktreeGit) -> None:
        self.bus, self.repository, self.rows, self.environments, self.places = bus, repository, rows, environments, places
        self.opening, self.git = opening, git

    def handle(self, command: OpenWorkerWorktree, context: Context) -> OpenedWorker:
        task = self.rows.required(Task, command.task_id)
        environment = self.environments.find(task.environment_id)
        if not environment.test:
            self.places.check_new_place()
        worker = self.bus.dispatch(command.start, context)
        name = self.free_name(environment, worker.id)
        try:
            worktree = self.repository.save(Worktree(session_agent_id=worker.id, task_id=task.id, creator_id=context.actor.id,
                                                     folder=str(Path(environment.folder) / WORKTREES_FOLDER / environment.name / name),
                                                     branch=f"journal/{environment.name}/{name}", base_branch=environment.branch, new_agent_reason=command.new_agent_reason, route_reason=command.route_reason, starts_program=command.starts_program), context)
        except Refusal:
            self.opening.remove_agent(worker.id, context)
            raise
        return OpenedWorker(worker, worktree)

    def free_name(self, environment: Environment, worker_id: int) -> str:
        names = (f"worker-{worker_id}" if count == 0 else f"worker-{worker_id}-{count}" for count in range(NAME_TRIES))
        return next(name for name in names if not self.is_taken(environment, name))

    def is_taken(self, environment: Environment, name: str) -> bool:
        return (FileAccess.exists(Path(environment.folder) / WORKTREES_FOLDER / environment.name / name)
                or self.git.has_branch(environment.folder, f"journal/{environment.name}/{name}"))
