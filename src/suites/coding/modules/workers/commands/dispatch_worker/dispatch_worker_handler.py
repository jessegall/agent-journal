from typing import TypeVar
from uuid import uuid4

from core.base.command.bus import Bus
from core.base.command.command import Command
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.provider.providers import Providers
from core.base.query.queries import Queries
from core.base.listener.event_rows import EventRows
from core.base.agent_type_book import AgentTypeBook
from core.base.profile.agent_profile import AgentProfile
from core.base.refusal import Refusal
from core.modules.profiles.support.profile_files import ProfileFiles
from core.base.scope.scopes import Scopes
from core.modules.agents.models.agent import Agent
from suites.coding.support.coding_agent_role import CodingAgentRole as AgentRole
from core.modules.agents.commands.start_agent.start_agent import StartAgent
from core.modules.environments.support.environment_rows import EnvironmentRows
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.enums.task_state import TaskState
from suites.coding.modules.workers.commands.dispatch_worker.dispatch_worker import DispatchWorker
from core.modules.helpers.support.allowed_models import AllowedModels
from suites.coding.modules.workers.support.worker_launch import WorkerLaunch
from suites.coding.modules.workers.support.worker_command import WorkerCommand
from suites.coding.modules.workers.commands.open_worker_worktree.open_worker_worktree import OpenWorkerWorktree
from suites.coding.modules.workers.commands.prepare_worktree.prepare_worktree import PrepareWorktree
from suites.coding.modules.workers.commands.record_worktree_cut.record_worktree_cut import RecordWorktreeCut
from suites.coding.modules.workers.commands.undo_worker_opening.undo_worker_opening import UndoWorkerOpening
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from suites.coding.modules.workers.support.worker_settings import WORKER_LIMIT

R = TypeVar("R")


class DispatchWorkerHandler(Handler[DispatchWorker, WorkerLaunch]):
    """Starts a worker: its agent row, a worktree cut from the environment's branch, its first task and the tasks
    delegated after it. Its rows are saved in short transactions before and after the git and prepare work, which
    run with no write open; a failure undoes the first."""

    command = DispatchWorker
    transactional = False

    def __init__(self, queries: Queries, bus: Bus, settings: SettingValues, git: WorktreeGit, worker_command: WorkerCommand, worktrees: WorktreeQuery,
                 providers: Providers, models: AllowedModels, environments: EnvironmentRows, rows: EventRows, types: AgentTypeBook, profiles: ProfileFiles, scopes: Scopes) -> None:
        self.queries, self.bus, self.settings = queries, bus, settings
        self.git, self.worker_command, self.worktrees, self.providers, self.models = git, worker_command, worktrees, providers, models
        self.environments, self.rows, self.types, self.profiles, self.scopes = environments, rows, types, profiles, scopes

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
        worker_limit = self.settings.number(WORKER_LIMIT)
        if len(self.worktrees.open_worktrees()) >= worker_limit:
            raise Refusal(f"{worker_limit} workers are out already", "merge or release one first, or raise journal.suites.coding.workers.worker-limit")
        caller = self.rows.find(Agent, context.actor.id)
        program = command.program or (caller.program if caller is not None else "")
        if not program:
            raise Refusal("a person's dispatch needs the program the worker runs", "add --program, such as the program of the environment's main agent")
        parent_id = caller.id if caller is not None else None
        profile = self.worker_profile(command.profile)
        model = command.program_model or profile.program_model(program)
        self.check_model(program, model)
        start = StartAgent(str(uuid4()), program, AgentRole.WORKER, parent_id, program_model=model, profile=profile.name, given_name=command.given_name)
        opened = self.recorded(OpenWorkerWorktree(start, task.id), context)
        try:
            base_commit = self.git.tip(environment.folder, environment.branch)
            self.git.cut(environment.folder, opened.worktree)
            self.recorded(PrepareWorktree(opened.worktree.folder, environment.folder, environment.name, command.library_links, command.library_copies), context)
            worktree = self.recorded(RecordWorktreeCut(opened.worktree.id, base_commit, tuple(listed.id for listed in tasks)), context)
        except Exception:
            self.git.remove(environment.folder, opened.worktree)
            self.recorded(UndoWorkerOpening(opened.worktree.id), context)
            raise
        return WorkerLaunch(opened.worker, worktree, self.worker_command.command(opened.worker, worktree, environment, task))

    def recorded(self, command: Command[R], context: Context) -> R:
        return self.bus.run(command, context.actor, environment_id=context.environment_id)

    def worker_profile(self, name: str) -> AgentProfile:
        worker_type = self.types.find(AgentRole.WORKER)
        profile = self.profiles.effective(name or worker_type.default_profile)
        if profile.agent_type != worker_type.key:
            raise Refusal(f"{profile.name} is a {self.types.find(profile.agent_type).label}: journal helper start runs it")
        return profile

    def check_model(self, program: str, model: str) -> None:
        names = self.models.allowed(self.providers.provider(program))
        if model not in names:
            raise Refusal(f"a worker is dispatched on a model {program} may run: {', '.join(names)}", "add --model <model>; journal worker models lists them")
