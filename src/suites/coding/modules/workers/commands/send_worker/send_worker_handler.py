from core.base.actor import Actor
from core.base.actor_type import ActorType
from dataclasses import replace
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.listener.event_rows import EventRows
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.support.nudger import Nudger
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.message import Message
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.commands.end_gone_worker.end_gone_worker import EndGoneWorker
from suites.coding.modules.workers.commands.send_worker.send_worker import SendWorker
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.gone_agents import GoneAgents
from suites.coding.modules.workers.support.worker_recipient import WorkerRecipient
from suites.coding.modules.workers.support.worker_job import WORKER_JOB_SOURCE
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from suites.coding.modules.workers.support.worker_task_advance import WorkerTaskAdvance
from core.modules.messages.support.work_sources import WorkSources
from suites.coding.modules.workers.bindings.worker_task_sources import WorkerTaskSources
from suites.coding.modules.workers.models.worker_task_source import WorkerTaskSource


class SendWorkerHandler(Handler[SendWorker, AgentLine]):
    """Send a job to a worker and prepare its worktree."""

    command = SendWorker
    runs_once = True
    disabled_scopes = [ActorScope]

    def __init__(self, rows: EventRows, worktrees: WorktreeQuery, repository: Repository, git: WorktreeGit, nudger: Nudger, advance: WorkerTaskAdvance, bus: Bus, missing_agents: GoneAgents, sources: WorkSources, task_sources: WorkerTaskSources) -> None:
        self.rows, self.worktrees, self.repository, self.git, self.nudger = rows, worktrees, repository, git, nudger
        self.advance, self.bus, self.missing_agents = advance, bus, missing_agents
        self.sources, self.task_sources = sources, task_sources
        self.conflicts: tuple[str, ...] = ()
        self.is_gone = False

    def prepare(self, command: SendWorker, actor: Actor) -> None:
        worker = self.rows.required(Agent, command.worker_id)
        if worker.retired_at is not None:
            raise Refusal(f"worker {worker.id} is retired, for good", "journal worker dispatch <task> starts a new one")
        self.is_gone = worker.ended_at is None and bool(self.missing_agents.find([worker]))
        worktree = self.worktrees.worker_worktree(command.worker_id)
        if worktree is None:
            return
        task = self.rows.required(Task, worktree.task_id)
        if not self.git.conflict_files(worktree):
            self.git.commit(worktree, f"task {task.id}: {task.title}", f"Journal: worker worker-{worktree.session_agent_id}")
        self.conflicts = tuple(self.git.sync(worktree))

    def handle(self, command: SendWorker, context: Context) -> AgentLine:
        worktree = self.worktrees.worker_worktree(command.worker_id)
        if worktree is None:
            raise Refusal(f"worker {command.worker_id} has no worktree", "journal worker dispatch <task> starts a new one")
        worker = self.rows.required(Agent, command.worker_id)
        resumed = worker.ended_at is not None or self.is_gone or worktree.state is WorktreeState.DELIVERED
        source_context = replace(context, environment_id=worktree.environment_id)
        source = self.sources.source_copy(source_context)
        previous = self.task_sources.current(replace(context, actor=Actor(command.worker_id, ActorType.AGENT)))
        if self.is_gone:
            self.bus.dispatch(EndGoneWorker(command.worker_id), context)
        if worktree.state is WorktreeState.DELIVERED:
            self.advance.restart_task(worktree, self.rows.required(Task, worktree.task_id), context)
            self.repository.save_change(worktree, worktree.moved(WorktreeLifecycle.rework), context)
        job = f"{command.job}\n{worktree.base_branch} is merged into your worktree and clashes on {', '.join(self.conflicts)}: settle the conflict markers first." if self.conflicts else command.job
        self.repository.save(Message(creator_id=context.actor.id, type=MessageType.PEER, text=command.job, read_at=context.timestamp, delivered_at=context.timestamp,
                                     recipient=WorkerRecipient.text(command.worker_id)), context)
        line = self.nudger.send_text(command.worker_id, job, WORKER_JOB_SOURCE, context)
        if resumed or source.differs_from(previous):
            self.repository.save(WorkerTaskSource(creator_id=context.actor.id, worktree_id=worktree.id, task_id=worktree.task_id,
                                                  environment_id=worktree.environment_id, source_message_id=source.message_id,
                                                  source_version=source.version, source_unavailable=source.unavailable, source_line_id=line.id,
                                                  started_at=context.timestamp if resumed else None), context)
            self.sources.use_copy(source, source_context)
        return line
