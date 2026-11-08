from uuid import uuid4
from suites.coding.modules.workers.commands.report_worker_route_fallback.report_worker_route_fallback import ReportWorkerRouteFallback
import json

from core.base.actor_type import ActorType
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
from core.modules.environments.models.environment import Environment
from core.modules.environments.support.environment_rows import EnvironmentRows
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.support.available_workers import AvailableWorkers
from suites.coding.modules.workers.support.worker_request import WorkerRequest
from suites.coding.modules.workers.support.worker_settings import LIBRARY_COPIES, LIBRARY_LINKS
from suites.coding.modules.workers.support.worker_places import WorkerPlaces
from suites.coding.modules.workers.support.worker_task_copies import WorkerTaskCopies
from suites.coding.modules.workers.commands.dispatch_worker.dispatch_worker import DispatchWorker
from core.modules.helpers.support.agent_admission import AgentAdmission
from core.modules.helpers.support.allowed_models import AllowedModels
from suites.coding.modules.workers.support.worker_routing import WorkerRouting
from suites.coding.modules.workers.support.worker_launch import WorkerLaunch
from suites.coding.modules.workers.support.worker_command import WorkerCommand
from suites.coding.modules.workers.commands.open_worker_worktree.open_worker_worktree import OpenWorkerWorktree
from suites.coding.modules.workers.commands.prepare_worktree.prepare_worktree import PrepareWorktree
from suites.coding.modules.workers.commands.record_worktree_cut.record_worktree_cut import RecordWorktreeCut
from suites.coding.modules.workers.commands.switch_worker_sandbox.switch_worker_sandbox import SwitchWorkerSandbox
from core.modules.messages.support.work_sources import WorkSources
from dataclasses import replace
from suites.coding.modules.workers.commands.cancel_worker_opening.cancel_worker_opening import CancelWorkerOpening
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from suites.coding.modules.workers.support.assignable_tasks import AssignableTasks
from suites.coding.modules.workers.support.started_task_release import StartedTaskRelease

class DispatchWorkerHandler(Handler[DispatchWorker, WorkerLaunch]):
    """Starts a worker and its tasks, runs git without a write lock and removes an opening that fails."""

    runs_once = True
    command = DispatchWorker

    def __init__(self, queries: Queries, bus: Bus, settings: SettingValues, git: WorktreeGit, worker_command: WorkerCommand, worktrees: WorktreeQuery,
                 providers: Providers, models: AllowedModels, routing: WorkerRouting, environments: EnvironmentRows, rows: EventRows, types: AgentTypeBook, profiles: ProfileFiles, scopes: Scopes, sources: WorkSources, places: WorkerPlaces, copies: WorkerTaskCopies, available_workers: AvailableWorkers, admission: AgentAdmission, release: StartedTaskRelease) -> None:
        self.release = release
        self.places, self.copies, self.available_workers, self.admission = places, copies, available_workers, admission
        self.queries, self.bus, self.settings = queries, bus, settings
        self.git, self.worker_command, self.worktrees, self.providers, self.models = git, worker_command, worktrees, providers, models
        self.environments, self.rows, self.types, self.profiles, self.scopes = environments, rows, types, profiles, scopes
        self.sources, self.routing = sources, routing

    def handle(self, command: DispatchWorker, context: Context) -> WorkerLaunch:
        read = self.queries.query(Task).find_many([command.task_id, *command.delegated_ids])
        tasks = AssignableTasks.checked(self.release.released(read, context.actor, context.environment_id))
        if not AssignableTasks.has_open(tasks):
            raise Refusal("every task here is blocked, and a new worker starts on an open one",
                          "assign blocked tasks to a kept worker with journal worker send <n> --task, or dispatch once one opens")
        with self.scopes.row_scope(tasks[0]):
            return self.dispatched(command, tasks, replace(context, environment_id=tasks[0].environment_id))

    def dispatched(self, command: DispatchWorker, tasks: list[Task], context: Context) -> WorkerLaunch:
        task = tasks[0]
        environment = self.environments.find(task.environment_id)
        caller = self.rows.find(Agent, context.actor.id)
        parent_id = caller.id if caller is not None else None
        profile = self.worker_profile(command.profile)
        self.admission.checked_new("worker", profile.name)
        self.check_unstarted(command, context, environment)
        choice = self.routing.choice(command, tasks, caller, profile, context)
        program, model = choice.program, choice.model
        self.check_model(program, model, profile.name)
        if not command.new_agent_reason.strip():
            self.check_idle(environment.folder, WorkerRequest(profile.name, program, model), tasks, command)
        start = StartAgent(command.session or str(uuid4()), program, AgentRole.WORKER, parent_id, program_model=model, profile=profile.name, given_name=command.given_name)
        source = self.sources.source_copy(replace(context, environment_id=task.environment_id))
        task_sources = self.copies.copies(tasks, source)
        opened = self.bus.run_with_context(OpenWorkerWorktree(start, task.id, command.new_agent_reason.strip(), choice.reason, command.starts_program), context)
        try:
            base_commit = self.git.tip(environment.folder, environment.branch)
            self.git.cut(environment.folder, opened.worktree)
            try:
                self.bus.run_with_context(PrepareWorktree(opened.worktree.folder, environment.folder, environment.name, command.library_links, command.library_copies, profile.name), context)
                worktree = self.bus.run_with_context(RecordWorktreeCut(opened.worktree.id, base_commit, tuple(listed.id for listed in tasks), task_sources, json.dumps(tuple(dict.fromkeys((*self.settings.texts(LIBRARY_LINKS), *command.library_links)))), json.dumps(tuple(dict.fromkeys((*self.settings.texts(LIBRARY_COPIES), *command.library_copies))))), context)
            except Exception:
                self.git.remove(environment.folder, opened.worktree)
                raise
        except Exception:
            self.bus.run_with_context(CancelWorkerOpening(opened.worktree.id), context)
            raise
        if not command.sandboxed:
            self.bus.run_with_context(SwitchWorkerSandbox(opened.worker.id, False), context)
        if choice.fallback is not None:
            self.bus.run_with_context(ReportWorkerRouteFallback(opened.worker.id, tuple(listed.id for listed in tasks), choice.fallback), context)
        return WorkerLaunch(opened.worker, worktree, self.worker_command.command(opened.worker, worktree, environment, task))

    @staticmethod
    def check_unstarted(command: DispatchWorker, context: Context, environment: Environment) -> None:
        granted = environment.test and environment.test_agent_id == context.actor.id
        if not command.starts_program and context.actor.type is not ActorType.USER and not granted:
            raise Refusal("only a person dispatches a worker with no program", "an agent dispatches a worker without --no-program")

    def check_idle(self, folder: str, request: WorkerRequest, tasks: list[Task], command: DispatchWorker) -> None:
        idle = self.available_workers.first(folder, request)
        if idle is not None:
            if command.plan_id is not None:
                phase = f" --phase {command.phase_id}" if command.phase_id is not None else ""
                raise Refusal(f"worker {idle.id} is idle: journal worker send {idle.id} --plan {command.plan_id}{phase}", 'or --fresh "<why>"')
            task_ids = " ".join(str(task.id) for task in tasks)
            raise Refusal(f"worker {idle.id} is idle: journal worker send {idle.id} --task {task_ids}", 'or --fresh "<why>"')

    def worker_profile(self, name: str) -> AgentProfile:
        worker_type = self.types.find(AgentRole.WORKER)
        profile = self.profiles.effective(name or worker_type.default_profile)
        if profile.agent_type != worker_type.key:
            raise Refusal(f"{profile.name} is a {self.types.find(profile.agent_type).label}: journal helper start runs it")
        return profile

    def check_model(self, program: str, model: str, profile: str) -> None:
        names = self.models.allowed(self.providers.provider(program), "worker", profile)
        if model not in names:
            raise Refusal(f"{model} cannot run on {program}; choose a model {program} may run: {', '.join(names)}", "use --tier for a model of that program; journal worker models lists them")
