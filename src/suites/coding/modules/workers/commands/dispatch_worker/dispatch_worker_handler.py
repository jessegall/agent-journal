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
from core.base.agent_type_book import AgentTypeBook
from core.base.profile.agent_profile import AgentProfile
from core.base.refusal import Refusal
from core.modules.profiles.support.profile_files import ProfileFiles
from core.base.repository.repository import Repository
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
                 worker_command: WorkerCommand, worktrees: WorktreeQuery, providers: Providers, models: AllowedModels, environments: EnvironmentRows, rows: EventRows, types: AgentTypeBook, profiles: ProfileFiles) -> None:
        self.queries, self.repository, self.bus, self.settings = queries, repository, bus, settings
        self.git, self.worker_command, self.worktrees, self.providers, self.models = git, worker_command, worktrees, providers, models
        self.environments, self.rows, self.types, self.profiles = environments, rows, types, profiles

    def handle(self, command: DispatchWorker, context: Context) -> WorkerLaunch:
        tasks = self.queries.query(Task).find_many([command.task_id, *command.delegated_ids])
        task = tasks[0]
        for listed in tasks:
            if listed.state is not TaskState.OPEN:
                raise Refusal(f"task {listed.id} is {listed.state.value}", "a worker is dispatched to an open task")
        environment = self.environments.find(task.environment_id)
        worker_limit = self.settings.number(WORKER_LIMIT, environment.id)
        if len(self.worktrees.environment_worktrees(environment.id)) >= worker_limit:
            raise Refusal(f"{worker_limit} workers are out already", "merge or release one first, or raise journal.suites.coding.workers.worker-limit")
        worker_context = replace(context, environment_id=environment.id)
        caller = self.rows.find(Agent, context.actor.id)
        program = command.program or (caller.program if caller is not None else "")
        if not program:
            raise Refusal("a person's dispatch needs the program the worker runs", "add --program, such as the program of the environment's main agent")
        parent_id = caller.id if caller is not None else None
        profile = self.worker_profile(command.profile)
        model = command.program_model or profile.program_model(program)
        self.check_model(program, model, environment.id)
        start = StartAgent(str(uuid4()), program, AgentRole.WORKER, parent_id, program_model=model, profile=profile.name, given_name=command.given_name)
        worker = self.bus.dispatch(start, worker_context)
        name = f"worker-{worker.id}"
        worktree = self.repository.save(Worktree(agent_id=worker.id, environment_id=environment.id, task_id=task.id, creator_id=context.actor.id,
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

    def worker_profile(self, name: str) -> AgentProfile:
        worker_type = self.types.find(AgentRole.WORKER)
        profile = self.profiles.effective(name or worker_type.default_profile)
        if profile.agent_type != worker_type.key:
            raise Refusal(f"{profile.name} is a {self.types.find(profile.agent_type).label}: journal helper start runs it")
        return profile

    def check_model(self, program: str, model: str, environment_id: int) -> None:
        names = self.models.allowed(self.providers.provider(program), environment_id)
        if model not in names:
            raise Refusal(f"a worker is dispatched on a model {program} may run: {', '.join(names)}", "add --model <model>; journal worker models lists them")
