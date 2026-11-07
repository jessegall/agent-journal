from uuid import uuid4
import json

from core.base.command.bus import Bus
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
from core.modules.tasks.support.task_waits import TaskWaits
from suites.coding.modules.workers.support.available_workers import AvailableWorkers
from suites.coding.modules.workers.support.worker_request import WorkerRequest
from suites.coding.modules.workers.support.worker_settings import LIBRARY_LINKS
from suites.coding.modules.workers.support.worker_places import WorkerPlaces
from suites.coding.modules.workers.support.worker_task_copies import WorkerTaskCopies
from suites.coding.modules.workers.commands.dispatch_worker.dispatch_worker import DispatchWorker
from core.modules.helpers.support.allowed_models import AllowedModels
from core.modules.helpers.support.helper_programs import HelperPrograms
from suites.coding.modules.workers.support.worker_launch import WorkerLaunch
from suites.coding.modules.workers.support.worker_command import WorkerCommand
from suites.coding.modules.workers.commands.open_worker_worktree.open_worker_worktree import OpenWorkerWorktree
from suites.coding.modules.workers.commands.prepare_worktree.prepare_worktree import PrepareWorktree
from suites.coding.modules.workers.commands.record_worktree_cut.record_worktree_cut import RecordWorktreeCut
from core.modules.messages.support.work_sources import WorkSources
from dataclasses import replace
from suites.coding.modules.workers.commands.cancel_worker_opening.cancel_worker_opening import CancelWorkerOpening
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worktree_git import WorktreeGit

class DispatchWorkerHandler(Handler[DispatchWorker, WorkerLaunch]):
    """Starts a worker: its agent row, a worktree cut from the environment's branch, its first task and the
    tasks delegated after it. Its rows are saved in short transactions before and after the git and prepare
    work, which run with no write open; a failure undoes the first."""

    command = DispatchWorker

    def __init__(self, queries: Queries, bus: Bus, settings: SettingValues, git: WorktreeGit, worker_command: WorkerCommand, worktrees: WorktreeQuery,
                 providers: Providers, programs: HelperPrograms, models: AllowedModels, environments: EnvironmentRows, rows: EventRows, types: AgentTypeBook, profiles: ProfileFiles, scopes: Scopes, sources: WorkSources, places: WorkerPlaces, copies: WorkerTaskCopies, available_workers: AvailableWorkers, waits: TaskWaits) -> None:
        self.places, self.copies, self.available_workers, self.waits = places, copies, available_workers, waits
        self.queries, self.bus, self.settings = queries, bus, settings
        self.git, self.worker_command, self.worktrees, self.providers, self.programs, self.models = git, worker_command, worktrees, providers, programs, models
        self.environments, self.rows, self.types, self.profiles, self.scopes = environments, rows, types, profiles, scopes
        self.sources = sources

    def handle(self, command: DispatchWorker, context: Context) -> WorkerLaunch:
        tasks = self.queries.query(Task).find_many([command.task_id, *command.delegated_ids])
        with self.scopes.row_scope(tasks[0]):
            return self.dispatched(command, tasks, context)

    def dispatched(self, command: DispatchWorker, tasks: list[Task], context: Context) -> WorkerLaunch:
        task = tasks[0]
        for listed in tasks:
            if not self.queueable(listed, listed is task):
                raise Refusal(f"task {listed.id} is {listed.state.value}", "a worker is dispatched to an open task")
        environment = self.environments.find(task.environment_id)
        caller = self.rows.find(Agent, context.actor.id)
        program = command.program or (caller.program if caller is not None else "")
        if not program:
            raise Refusal("a person's dispatch needs the program the worker runs", "add --program, such as the program of the environment's main agent")
        parent_id = caller.id if caller is not None else None
        profile = self.worker_profile(command.profile)
        model = command.program_model or self.providers.provider(program).profile_model(profile)
        self.check_model(program, model)
        self.programs.installed(program)
        if not command.new_agent_reason.strip():
            self.check_idle(environment.folder, WorkerRequest(profile.name, program, model), tasks)
        start = StartAgent(str(uuid4()), program, AgentRole.WORKER, parent_id, program_model=model, profile=profile.name, given_name=command.given_name)
        source = self.sources.source_copy(replace(context, environment_id=task.environment_id))
        task_sources = self.copies.copies(tasks, source)
        opened = self.bus.run_with_context(OpenWorkerWorktree(start, task.id, command.new_agent_reason.strip()), context)
        try:
            base_commit = self.git.tip(environment.folder, environment.branch)
            self.git.cut(environment.folder, opened.worktree)
            self.bus.run_with_context(PrepareWorktree(opened.worktree.folder, environment.folder, environment.name, command.library_links, command.library_copies), context)
            worktree = self.bus.run_with_context(RecordWorktreeCut(opened.worktree.id, base_commit, tuple(listed.id for listed in tasks), task_sources, json.dumps(tuple(dict.fromkeys((*self.settings.texts(LIBRARY_LINKS), *command.library_links))))), context)
        except Exception:
            self.git.remove(environment.folder, opened.worktree)
            self.bus.run_with_context(CancelWorkerOpening(opened.worktree.id), context)
            raise
        return WorkerLaunch(opened.worker, worktree, self.worker_command.command(opened.worker, worktree, environment, task))

    def queueable(self, task: Task, is_first: bool) -> bool:
        return task.state is TaskState.OPEN or (not is_first and task.state is TaskState.BLOCKED and self.waits.waits_target_tasks(task.id))

    def check_idle(self, folder: str, request: WorkerRequest, tasks: list[Task]) -> None:
        idle = self.available_workers.first(folder, request)
        if idle is not None:
            task_ids = " ".join(str(task.id) for task in tasks)
            raise Refusal(f"worker {idle.id} is idle: journal worker send {idle.id} --task {task_ids}", 'or --fresh "<why>"')

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
