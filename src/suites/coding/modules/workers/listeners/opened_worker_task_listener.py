import shlex
from dataclasses import replace

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.change.moved import Moved
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.listener.event_rows import EventRows
from core.base.listener.save_listener import SaveListener
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.modules.workers.commands.queue_worker_operation.queue_worker_operation import QueueWorkerOperation
from suites.coding.modules.workers.commands.send_worker.send_worker import SendWorker
from suites.coding.modules.workers.models.enums.worker_operation_name import WorkerOperationName
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.queries.worker_operation_query import WorkerOperationQuery
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_proof_queue import WorkerProofQueue
from suites.coding.support.coding_agent_role import CodingAgentRole as AgentRole


class OpenedWorkerTaskListener(SaveListener[Moved[Task]]):
    """A blocked task given to a worker goes to that worker once it opens: a worker busy with other work takes it
    as its next task, and an idle one is sent it, on the main agent's behalf."""

    name = "workers.opened-task"
    moves = tuple([TaskLifecycle.unblock])
    disabled_scopes = [ActorScope]

    def __init__(self, rows: EventRows, tasks: TaskQuery, worktrees: WorktreeQuery, proof_queue: WorkerProofQueue,
                 operations: WorkerOperationQuery, bus: Bus) -> None:
        self.rows, self.tasks, self.worktrees, self.proof_queue = rows, tasks, worktrees, proof_queue
        self.operations, self.bus = operations, bus

    def handle(self, event: Moved[Task], context: Context) -> None:
        task = event.row
        if task.delegated_to is None:
            return
        worker = self.rows.required(Agent, task.delegated_to)
        if not self.is_idle(worker):
            return
        operation_line = shlex.join(["worker", "send", str(worker.id), "--task", str(task.id), "--wait"])
        send_command = SendWorker(worker.id, task_ids=tuple([task.id]))
        self.bus.dispatch(QueueWorkerOperation(worker.id, operation_line, send_command, WorkerOperationName.JOB), replace(context, actor=Actor(worker.parent_id, ActorType.AGENT)))

    def is_idle(self, worker: Agent) -> bool:
        if worker.role != AgentRole.WORKER or worker.retired_at is not None or worker.parent_id is None:
            return False
        if self.tasks.started_tasks(worker.id) or self.operations.active(worker.id) is not None:
            return False
        if self.worktrees.newest_worktree(worker.id) is None:
            return False
        worktree = self.worktrees.worker_worktree(worker.id)
        return worktree is None or (worktree.state is WorktreeState.DELIVERED and not self.proof_queue.tests_pending(worktree))
