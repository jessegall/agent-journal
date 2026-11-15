from dataclasses import replace

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.command.bus import Bus
from engine.command.context import Context
from engine.listener.rows.event_rows import EventRows
from engine.repository.repository import Repository
from engine.driver.nudger import MessageSender
from core.modules.tasks.commands.start_task.start_task import StartTask
from core.modules.tasks.commands.reset_task_reads.reset_task_reads import ResetTaskReads
from core.modules.tasks.support.task_brief_blocks import TaskBriefBlocks
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.worker_job import WORKER_JOB_SOURCE
from suites.coding.modules.workers.support.worker_guidance import WorkerGuidance
from suites.coding.modules.workers.nudges.worker_next_task_message import WorkerNextTaskMessage
from suites.coding.modules.workers.nudges.worker_task_reassignment_message import WorkerTaskReassignmentMessage
from suites.coding.modules.workers.nudges.worker_task_reassigned_message import WorkerTaskReassignedMessage


class WorkerTaskAdvance:
    """Starts a worker's next task on its worktree and tells the worker which one it is and how to read it."""

    def __init__(self, bus: Bus, repository: Repository, nudger: MessageSender, blocks: TaskBriefBlocks, rows: EventRows, guidance: WorkerGuidance) -> None:
        self.guidance = guidance
        self.bus, self.repository, self.nudger = bus, repository, nudger
        self.blocks, self.rows = blocks, rows

    def next_task(self, worktree: Worktree, following: Task, context: Context) -> None:
        self.start(worktree, following, context)
        self.nudger.send(worktree.session_agent_id, WorkerNextTaskMessage.declared(), WORKER_JOB_SOURCE, context, task=following.id, line=self.guidance.line(worktree.session_agent_id))

    def after_reassigned_task(self, worktree: Worktree, reassigned: Task, following: Task, context: Context) -> None:
        self.start(worktree, following, context)
        self.nudger.send(worktree.session_agent_id, WorkerTaskReassignedMessage.declared(), WORKER_JOB_SOURCE, context, task=reassigned.id)
        self.nudger.send(worktree.session_agent_id, WorkerTaskReassignmentMessage.declared(), WORKER_JOB_SOURCE, context, task=following.id)

    def start(self, worktree: Worktree, following: Task, context: Context) -> None:
        self.bus.dispatch(StartTask(following.id), replace(context, actor=Actor(worktree.session_agent_id, ActorType.AGENT)))
        current = self.rows.required(Worktree, worktree.id)
        if current.task_id != following.id:
            self.repository.save_change(current, current.moved(WorktreeLifecycle.advance, task_id=following.id), context)

    def restart_task(self, worktree: Worktree, task: Task, context: Context) -> None:
        worker_context = replace(context, actor=Actor(worktree.session_agent_id, ActorType.AGENT))
        self.bus.dispatch(ResetTaskReads(worktree.session_agent_id), worker_context)
        if task.state is TaskState.COMPLETED:
            self.repository.save_change(task, task.reopen(context.timestamp, context.actor), context)
            self.bus.dispatch(StartTask(task.id), replace(context, actor=Actor(worktree.session_agent_id, ActorType.AGENT)))
            return
        if task.state is not TaskState.STARTED:
            self.repository.save_change(task, task.moved(TaskLifecycle.retest, holder_id=worktree.session_agent_id), context)
        self.blocks.block_unread(worktree.session_agent_id, task, worker_context)
