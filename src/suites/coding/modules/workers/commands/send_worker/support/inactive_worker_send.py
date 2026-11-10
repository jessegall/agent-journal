import shlex
from dataclasses import replace

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.command.bus import Bus
from engine.command.context import Context
from engine.listener.event_rows import EventRows
from core.modules.agents.models.agent import Agent
from core.modules.drivers.support.nudger import Nudger
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.modules.workers.commands.queue_worker_operation.queue_worker_operation import QueueWorkerOperation
from suites.coding.modules.workers.commands.send_worker.send_worker import SendWorker
from suites.coding.modules.workers.models.enums.worker_operation_name import WORKER_OPERATION_PAUSED, WorkerOperationName
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.queries.worker_operation_query import WorkerOperationQuery
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_job import WORKER_JOB_SOURCE
from suites.coding.modules.workers.support.worker_proof_queue import WorkerProofQueue
from suites.coding.support.coding_helper_role import CodingHelperRole


class InactiveWorkerSend:
    """Sends a task given to a worker to that worker at once, on the main agent's behalf, when the worker is
    idle: no started task, no command running, and no worktree, a delivered one with no tests waiting, or
    an open one whose program has ended. A busy worker takes the task as its next one by itself."""

    def __init__(self, rows: EventRows, tasks: TaskQuery, worktrees: WorktreeQuery, proof_queue: WorkerProofQueue,
                 operations: WorkerOperationQuery, bus: Bus, nudger: Nudger) -> None:
        self.rows, self.tasks, self.worktrees, self.proof_queue = rows, tasks, worktrees, proof_queue
        self.operations, self.bus, self.nudger = operations, bus, nudger

    def send(self, task: Task, context: Context) -> None:
        if task.delegated_to is None:
            return
        worker = self.rows.required(Agent, task.delegated_to)
        if worker.parent_id is None:
            return
        if worker.paused_at is not None:
            self.nudger.send(worker.parent_id, WORKER_OPERATION_PAUSED, WORKER_JOB_SOURCE, context, worker=worker.id)
            return
        if not self.is_idle(worker):
            return
        operation_line = shlex.join(["worker", "send", str(worker.id), "--task", str(task.id), "--wait"])
        worker_job_command = SendWorker(worker.id, task_ids=tuple([task.id]))
        self.bus.dispatch(QueueWorkerOperation(worker.id, operation_line, worker_job_command, WorkerOperationName.JOB), replace(context, actor=Actor(worker.parent_id, ActorType.AGENT)))

    def is_idle(self, worker: Agent) -> bool:
        if worker.role != CodingHelperRole.WORKER or worker.retired_at is not None or worker.parent_id is None:
            return False
        if self.tasks.started_tasks(worker.id) or self.operations.active(worker.id) is not None:
            return False
        if self.worktrees.newest_worktree(worker.id) is None:
            return False
        worktree = self.worktrees.worker_worktree(worker.id)
        if worktree is None:
            return True
        if worktree.state is WorktreeState.DELIVERED:
            return not self.proof_queue.tests_pending(worktree)
        return worktree.state is WorktreeState.CUT and worker.ended_at is not None
