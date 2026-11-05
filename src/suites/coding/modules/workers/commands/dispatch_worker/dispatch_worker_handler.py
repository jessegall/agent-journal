from dataclasses import replace
from pathlib import Path
from uuid import uuid4

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.provider.providers import Providers
from core.base.query.queries import Queries
from core.base.listener.event_rows import EventRows
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.base.scope.scopes import Scopes
from core.modules.agents.models.agent import Agent
from suites.coding.support.coding_agent_role import CodingAgentRole as AgentRole
from core.modules.agents.commands.start_agent.start_agent import StartAgent
from core.modules.environments.support.environment_rows import EnvironmentRows
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.tasks.models.task import Task
from core.modules.tasks.commands.start_task.start_task import StartTask
from core.modules.tasks.models.enums.task_state import TaskState
from suites.coding.modules.workers.commands.dispatch_worker.dispatch_worker import DispatchWorker
from core.modules.helpers.support.allowed_models import AllowedModels
from suites.coding.modules.workers.support.worker_launch import WorkerLaunch
from suites.coding.modules.workers.support.worker_command import WorkerCommand
from suites.coding.modules.workers.commands.prepare_worktree.prepare_worktree import PrepareWorktree
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from suites.coding.modules.workers.support.worker_settings import WORKER_LIMIT

WORKTREES_FOLDER = Path(".journal") / "worktrees"


class DispatchWorkerHandler(Handler[DispatchWorker, WorkerLaunch]):
    """Starts a worker: its agent row, a worktree cut from the environment's branch, its first task and the tasks
    delegated after it; a failure undoes it."""

    command = DispatchWorker

    def __init__(self, queries: Queries, repository: Repository, bus: Bus, settings: SettingValues, git: WorktreeGit,
                 worker_command: WorkerCommand, worktrees: WorktreeQuery, providers: Providers, models: AllowedModels, environments: EnvironmentRows, rows: EventRows, scopes: Scopes) -> None:
        self.queries, self.repository, self.bus, self.settings = queries, repository, bus, settings
        self.git, self.worker_command, self.worktrees, self.providers, self.models = git, worker_command, worktrees, providers, models
        self.environments, self.rows, self.scopes = environments, rows, scopes

    def handle(self, command: DispatchWorker, context: Context) -> WorkerLaunch:
        tasks = self.queries.query(Task).find_many([command.task_id, *command.delegated_ids])
        with self.scopes.row_scope(tasks[0]):
            return self.dispatched(command, tasks, context)

    def dispatched(self, command: DispatchWorker, tasks: list[Task], context: Context) -> WorkerLaunch:
        task = tasks[0]
        for listed in tasks:
            if listed.state is not TaskState.OPEN:
                raise Refusal(f"task {listed.id} is {listed.state.value}", "a worker is dispatched to an open task")
        environment = self.environments.find(task.environment_id)
        worker_limit = self.settings.number(WORKER_LIMIT, environment.id)
        if len(self.worktrees.open_worktrees()) >= worker_limit:
            raise Refusal(f"{worker_limit} workers are out already", "merge or release one first, or raise journal.suites.coding.workers.worker-limit")
        worker_context = replace(context, environment_id=environment.id)
        caller = self.rows.find(Agent, context.actor.id)
        program = command.program or (caller.program if caller is not None else "")
        if not program:
            raise Refusal("a person's dispatch needs the program the worker runs", "add --program, such as the program of the environment's main agent")
        parent_id = caller.id if caller is not None else None
        self.check_model(program, command.program_model)
        start = StartAgent(str(uuid4()), program, AgentRole.WORKER, parent_id, program_model=command.program_model, profile=command.profile, given_name=command.given_name)
        worker = self.bus.dispatch(start, worker_context)
        name = f"worker-{worker.id}"
        worktree = self.repository.save(Worktree(session_agent_id=worker.id, task_id=task.id, creator_id=context.actor.id,
                                                 folder=str(Path(environment.folder) / WORKTREES_FOLDER / environment.name / name),
                                                 branch=f"journal/{environment.name}/{name}", base_branch=environment.branch), worker_context)
        base_commit = self.git.tip(environment.folder, environment.branch)
        try:
            self.git.cut(environment.folder, worktree)
            self.bus.dispatch(PrepareWorktree(worktree.folder, environment.folder, environment.name, command.library_links, command.library_copies), worker_context)
            worktree = self.repository.save_change(worktree, worktree.cut(context.timestamp, context.actor, base_commit), worker_context)
            for listed in tasks:
                self.repository.update(listed, worker_context, delegated_to=worker.id)
            self.bus.dispatch(StartTask(task.id), replace(worker_context, actor=Actor(worker.id, ActorType.AGENT)))
        except Exception:
            self.git.remove(environment.folder, worktree)
            raise
        return WorkerLaunch(worker, worktree, self.worker_command.command(worker, worktree, environment, task))

    def check_model(self, program: str, model: str) -> None:
        names = self.models.allowed(self.providers.provider(program))
        if model not in names:
            raise Refusal(f"a worker is dispatched on a model {program} may run: {', '.join(names)}", "add --model <model>; journal worker models lists them")
