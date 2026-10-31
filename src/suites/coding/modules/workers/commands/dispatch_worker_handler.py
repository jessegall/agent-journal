from dataclasses import replace
from pathlib import Path
from uuid import uuid4

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.base.agent_role import AgentRole
from core.modules.agents.commands.start_agent import StartAgent
from core.modules.environments.models.environment import Environment
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.tasks.models.task import Task
from core.modules.tasks.commands.start_task import StartTask
from core.modules.tasks.models.enums.task_state import TaskState
from suites.coding.modules.workers.commands.dispatch_worker import DispatchWorker
from suites.coding.modules.workers.support.worker_launch import WorkerLaunch
from suites.coding.modules.workers.support.worker_command import WorkerCommand
from suites.coding.modules.workers.commands.prepare_worktree import PrepareWorktree
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from suites.coding.modules.workers.support.worker_settings import WORKER_LIMIT

WORKTREES_FOLDER = Path(".journal") / "worktrees"


class DispatchWorkerHandler(Handler[DispatchWorker, WorkerLaunch]):
    """Starts a worker: its agent row, a worktree cut from the environment's branch, its task; a failure undoes it."""

    command = DispatchWorker

    def __init__(self, queries: Queries, repository: Repository, bus: Bus, settings: SettingValues, git: WorktreeGit,
                 worker_command: WorkerCommand, worktrees: WorktreeQuery) -> None:
        self.queries, self.repository, self.bus, self.settings = queries, repository, bus, settings
        self.git, self.worker_command, self.worktrees = git, worker_command, worktrees

    def handle(self, command: DispatchWorker, context: Context) -> WorkerLaunch:
        task = self.queries.query(Task).find(command.task_id)
        if task.state is not TaskState.OPEN:
            raise Refusal(f"task {task.id} is {task.state.value}", "a worker is dispatched to an open task")
        environment = self.queries.query(Environment).find(task.environment_id)
        worker_limit = self.settings.number(WORKER_LIMIT, environment.id)
        if len(self.worktrees.environment_worktrees(environment.id)) >= worker_limit:
            raise Refusal(f"{worker_limit} workers are out already", "merge or release one first, or raise journal.suites.coding.workers.worker-limit")
        worker_context = replace(context, environment_id=environment.id)
        callers = self.queries.query(Agent).filter(id=context.actor.id).page(1, 1).rows
        program = command.program or (callers[0].program if callers else "")
        if not program:
            raise Refusal("a person's dispatch needs the program the worker runs", "add --program, such as the program of the environment's main agent")
        parent_id = callers[0].id if callers else None
        start = StartAgent(str(uuid4()), program, AgentRole.WORKER, parent_id)
        worker = self.bus.dispatch(start, worker_context)
        name = f"worker-{worker.id}"
        worktree = self.repository.save(Worktree(agent_id=worker.id, environment_id=environment.id, task_id=task.id, creator_id=context.actor.id,
                                                 folder=str(Path(environment.folder) / WORKTREES_FOLDER / environment.name / name),
                                                 branch=f"journal/{environment.name}/{name}", base_branch=environment.branch), worker_context)
        base_commit = self.git.tip(environment.folder, environment.branch)
        try:
            self.git.cut(environment.folder, worktree)
            self.bus.dispatch(PrepareWorktree(worktree.folder, environment.folder, environment.name, command.library_links, command.library_copies), worker_context)
            worktree = self.repository.save(worktree.cut(context.timestamp, context.actor, base_commit), worker_context)
            self.bus.dispatch(StartTask(task.id), replace(worker_context, actor=Actor(worker.id, ActorType.AGENT)))
        except Exception:
            self.git.remove(environment.folder, worktree)
            raise
        return WorkerLaunch(worker, worktree, self.worker_command.command(worker, worktree, environment, task))
