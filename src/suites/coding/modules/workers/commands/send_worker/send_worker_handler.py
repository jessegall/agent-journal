from collections.abc import Sequence
from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from dataclasses import replace
import json
from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from core.base.listener.event_rows import EventRows
from engine.errors.refusal import Refusal
from core.modules.helpers.support.agent_admission import AgentAdmission
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from engine.scope.scopes import Scopes
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.support.nudger import Nudger
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.message import Message
from core.modules.tasks.models.task import TASK_TITLE_LIMIT_CHARACTERS, Task
from core.modules.environments.support.environment_rows import EnvironmentRows
from core.modules.settings.bindings.support.setting_values import SettingValues
from suites.coding.modules.workers.commands.record_worktree_libraries.record_worktree_libraries import RecordWorktreeLibraries
from suites.coding.modules.workers.support.library_folders import LibraryFolders
from suites.coding.modules.workers.support.worker_settings import LIBRARY_COPIES, LIBRARY_LINKS
from suites.coding.modules.workers.commands.cancel_worker_opening.cancel_worker_opening import CancelWorkerOpening
from suites.coding.modules.workers.commands.record_worktree_removal.record_worktree_removal import RecordWorktreeRemoval
from suites.coding.modules.workers.commands.end_gone_worker.end_gone_worker import EndGoneWorker
from suites.coding.modules.workers.commands.open_kept_worktree.open_kept_worktree import OpenKeptWorktree
from suites.coding.modules.workers.commands.prepare_worktree.prepare_worktree import PrepareWorktree
from suites.coding.modules.workers.commands.record_worktree_cut.record_worktree_cut import RecordWorktreeCut
from suites.coding.modules.workers.commands.send_worker.send_worker import SendWorker
from suites.coding.modules.workers.commands.switch_worker_sandbox.switch_worker_sandbox import SwitchWorkerSandbox
from suites.coding.modules.workers.commands.send_worker.make_worker_job import MakeWorkerJob
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.gone_agents import GoneAgents
from suites.coding.modules.workers.support.kept_worker_tasks import KeptWorkerTasks
from suites.coding.modules.workers.support.worker_recipient import WorkerRecipient
from suites.coding.modules.workers.support.retired_worker_refusal import RetiredWorkerRefusal
from suites.coding.modules.workers.support.worker_job import WORKER_JOB_SOURCE
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from suites.coding.modules.workers.support.started_task_release import StartedTaskRelease
from suites.coding.modules.workers.commands.name_worker_tests.name_worker_tests import NameWorkerTests
from suites.coding.modules.workers.support.worker_task_advance import WorkerTaskAdvance
from core.modules.messages.support.work_sources import WorkSources
from suites.coding.modules.workers.bindings.worker_task_sources import WorkerTaskSources
from suites.coding.modules.workers.models.worker_task_source import WorkerTaskSource


class SendWorkerHandler(Handler[SendWorker, AgentLine]):
    """Send a job to a worker and prepare its worktree."""

    command = SendWorker
    runs_once = True
    disabled_scopes = [ActorScope]

    def __init__(self, rows: EventRows, worktrees: WorktreeQuery, repository: Repository, git: WorktreeGit, nudger: Nudger, advance: WorkerTaskAdvance, bus: Bus, missing_agents: GoneAgents, sources: WorkSources, task_sources: WorkerTaskSources, kept_tasks: KeptWorkerTasks, environments: EnvironmentRows, settings: SettingValues, scopes: Scopes, admission: AgentAdmission, libraries: LibraryFolders, release: StartedTaskRelease) -> None:
        self.admission, self.libraries, self.release = admission, libraries, release
        self.rows, self.worktrees, self.repository, self.git, self.nudger = rows, worktrees, repository, git, nudger
        self.advance, self.bus, self.missing_agents = advance, bus, missing_agents
        self.sources, self.task_sources, self.kept_tasks, self.environments = sources, task_sources, kept_tasks, environments
        self.settings, self.scopes = settings, scopes
        self.conflicts: tuple[str, ...] = ()
        self.is_gone = False
        self.task_ids: tuple[int, ...] = ()

    def check_job(self, command: SendWorker, worker: Agent) -> None:
        if worker.retired_at is not None:
            raise RetiredWorkerRefusal.create(worker.id)
        if not command.job.strip() and not command.task_ids:
            raise Refusal("a send needs a job or a task", f'journal worker send {worker.id} "<job>", or --task <task>')

    def check_session(self, worker: Agent) -> None:
        if worker.ended_at is not None:
            self.admission.checked_resume("worker", worker.profile)
            self.admission.checked_model("worker", worker.profile, worker.program, worker.program_model)

    def check_rows(self, command: SendWorker, actor: Actor) -> None:
        worker = self.rows.required(Agent, command.worker_id)
        self.check_job(command, worker)
        self.check_session(worker)
        if command.task_ids:
            self.kept_tasks.check_tasks(command.task_ids, actor.id)
        if self.worktrees.newest_worktree(worker.id) is None:
            raise Refusal(f"worker {worker.id} has no worktree", "journal worker dispatch <task> starts a new one")

    def prepare(self, command: SendWorker, actor: Actor) -> None:
        worker = self.rows.required(Agent, command.worker_id)
        self.check_job(command, worker)
        self.check_session(worker)
        self.remove_merged(worker, actor)
        task_ids = command.task_ids
        if not task_ids and self.worktrees.worker_worktree(worker.id) is None:
            self.kept_tasks.check_recut(worker)
            title = command.job.strip().splitlines()[0][:TASK_TITLE_LIMIT_CHARACTERS]
            task = self.bus.run(MakeWorkerJob(title, command.job), actor, environment_id=worker.environment_id)
            task_ids = tuple([task.id])
        self.task_ids = task_ids
        if task_ids:
            read = self.release.released(self.kept_tasks.read_tasks(task_ids), actor, worker.environment_id)
            tasks = self.kept_tasks.checked_cut(worker, task_ids, read)
            if tasks:
                self.cut(worker, tasks, command, actor)
        self.is_gone = worker.ended_at is None and bool(self.missing_agents.find([worker]))
        worktree = self.worktrees.worker_worktree(command.worker_id)
        if worktree is None:
            return
        if worktree.libraries_dropped_at is not None:
            self.libraries.restore(self.environments.find(worker.environment_id).folder, worktree.folder, json.loads(worktree.library_copies))
            self.bus.run(RecordWorktreeLibraries(worktree.id, False), actor, environment_id=worker.environment_id)
        task = self.rows.required(Task, worktree.task_id)
        if not self.git.conflict_files(worktree):
            self.git.commit(worktree, f"task {task.id}: {task.title}", f"Journal: worker worker-{worktree.session_agent_id}")
        self.conflicts = tuple(self.git.sync(worktree))

    def remove_merged(self, worker: Agent, actor: Actor) -> None:
        worktree = self.worktrees.worker_worktree(worker.id)
        if worktree is None or worktree.state is not WorktreeState.MERGED:
            return
        self.git.remove(self.environments.find(worker.environment_id).folder, worktree)
        self.bus.run(RecordWorktreeRemoval(worktree.id), actor, environment_id=worker.environment_id)

    def job_text(self, command: SendWorker, worktree: Worktree) -> str:
        if not self.conflicts:
            return command.job
        return f"{command.job}\n{worktree.base_branch} is merged into your worktree and clashes on {', '.join(self.conflicts)}: settle the conflict markers first."

    def cut(self, worker: Agent, tasks: Sequence[Task], command: SendWorker, actor: Actor) -> None:
        environment = self.environments.find(worker.environment_id)
        last = self.worktrees.required_newest_worktree(worker.id)
        links = tuple(dict.fromkeys((*json.loads(last.library_links), *command.library_links)))
        with self.scopes.row_scope(worker):
            configured = self.settings.texts(LIBRARY_LINKS)
            configured_copies = self.settings.texts(LIBRARY_COPIES)
        extra_links = tuple(link for link in links if link not in configured)
        opened = self.bus.run(OpenKeptWorktree(worker.id, tasks[0].id), actor, environment_id=worker.environment_id)
        try:
            start = self.git.start(environment.folder, opened, tuple(task.id for task in tasks))
            self.git.cut(environment.folder, opened, start.point)
            try:
                self.bus.run(PrepareWorktree(opened.folder, environment.folder, environment.name, extra_links, command.library_copies, worker.profile), actor,
                             environment_id=worker.environment_id)
                self.bus.run(RecordWorktreeCut(opened.id, start.base_commit, tuple(task.id for task in tasks), library_links=json.dumps(tuple(dict.fromkeys((*configured, *links)))), library_copies=json.dumps(tuple(dict.fromkeys((*configured_copies, *command.library_copies))))), actor, environment_id=worker.environment_id)
            except Exception:
                self.git.remove(environment.folder, opened)
                raise
        except Exception:
            self.bus.run(CancelWorkerOpening(opened.id, retain_agent=True), actor, environment_id=worker.environment_id)
            raise

    def handle(self, command: SendWorker, context: Context) -> AgentLine:
        if command.test_commands:
            self.bus.run_with_context(NameWorkerTests(command.worker_id, command.test_commands), context)
        worktree = self.worktrees.worker_worktree(command.worker_id)
        if worktree is None and self.task_ids:
            return self.kept_tasks.waiting(self.rows.required(Agent, command.worker_id), self.task_ids, context)
        if worktree is None:
            raise Refusal(f"worker {command.worker_id} has no worktree", "journal worker dispatch <task> starts a new one")
        worker = self.rows.required(Agent, command.worker_id)
        if not command.sandboxed:
            worker = self.bus.run_with_context(SwitchWorkerSandbox(worker.id, False), context)
        resumed = worker.ended_at is not None or self.is_gone or worktree.state is WorktreeState.DELIVERED
        source_context = replace(context, environment_id=worktree.environment_id)
        source = self.sources.source_copy(source_context)
        previous = self.task_sources.current(replace(context, actor=Actor(command.worker_id, ActorType.AGENT)))
        if self.is_gone:
            self.bus.dispatch(EndGoneWorker(command.worker_id), context)
        if command.job:
            self.repository.save(Message(creator_id=context.actor.id, type=MessageType.PEER, text=command.job, read_at=context.timestamp, delivered_at=context.timestamp,
                                         recipient=WorkerRecipient.text(command.worker_id)), context)
        if self.task_ids:
            return self.kept_tasks.handed(worker, worktree, self.task_ids, self.job_text(command, worktree), context)
        if worktree.state is WorktreeState.DELIVERED:
            self.advance.restart_task(worktree, self.rows.required(Task, worktree.task_id), context)
            self.repository.save_change(worktree, worktree.moved(WorktreeLifecycle.rework), context)
        job = self.job_text(command, worktree)
        line = self.nudger.send_text(command.worker_id, job, WORKER_JOB_SOURCE, context)
        if resumed or source.changed(previous):
            with self.scopes.row_scope(worktree):
                self.repository.save(WorkerTaskSource(creator_id=context.actor.id, worktree_id=worktree.id, task_id=worktree.task_id,
                                                      source_message_id=source.message_id, source_version=source.version,
                                                      source_unavailable=source.unavailable, source_line_id=line.id,
                                                      started_at=context.timestamp if resumed else None), context)
            self.sources.use_copy(source, source_context)
        return line
