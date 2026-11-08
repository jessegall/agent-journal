from core.base.driver.nudge import Nudge
from core.modules.processes.models.process import Process
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.enums.task_state import TaskState
from suites.coding.modules.workers.models.enums.worker_operation_name import WorkerOperationName, WORKER_OPERATION_NEXT, WORKER_OPERATION_TESTS, WORKER_OPERATION_CONFLICT
from suites.coding.modules.workers.support.worker_proof_queue import WorkerProofQueue
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from suites.coding.modules.workers.models.worker_operation import WorkerOperation
from suites.coding.modules.workers.support.worker_nudges import WORKER_OPERATION_FAILED
from core.modules.processes.events.process_ended import ProcessEnded
from suites.coding.support.coding_helper_role import CodingHelperRole
from core.base.listener.save_listener import SaveListener
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.support.nudger import Nudger
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_job import WORKER_JOB_SOURCE
from suites.coding.modules.workers.support.worker_nudges import WORKER_RUN_ENDED
from suites.coding.modules.workers.support.worker_stop import WorkerStop
from core.base.command.context import Context


class WorkerRunEndedListener(SaveListener[ProcessEnded]):
    """A worker that has stopped while a run of its own went on in the background is told when the run
    ends, by a job line, which starts it again on its session; one a person or another agent stopped, or
    that asked for help, stays stopped."""

    name = "workers.run-ended"
    disabled_scopes = [ActorScope]

    def __init__(self, agents: AgentRows, worktrees: WorktreeQuery, nudger: Nudger, stop: WorkerStop, queries: Queries, repository: Repository, proof_queue: WorkerProofQueue) -> None:
        self.queries, self.repository, self.proof_queue = queries, repository, proof_queue
        self.agents, self.worktrees, self.nudger, self.stop = agents, worktrees, nudger, stop

    def handle(self, event: ProcessEnded, context: Context) -> None:
        process = event.row
        operation = self.queries.query(WorkerOperation).filter(process_id=process.id).first()
        if operation is not None:
            if operation.ended_at is None:
                self.repository.update(operation, context, ended_at=context.timestamp)
                self.nudger.send_nudge(operation.recipient_id, self.operation_nudge(operation, process), WORKER_JOB_SOURCE, context)
            return
        agent = self.agents.find(process.session_agent_id)
        if agent.role != CodingHelperRole.WORKER or agent.ended_at is None:
            return
        worktree = self.worktrees.worker_worktree(agent.id)
        if worktree is None or worktree.state is not WorktreeState.CUT:
            return
        if self.stop.was_stopped(agent) or self.stop.has_open_help_request(agent.id):
            return
        self.nudger.send(agent.id, WORKER_RUN_ENDED, WORKER_JOB_SOURCE, context, output=process.id)

    def operation_nudge(self, operation: WorkerOperation, process: Process) -> Nudge:
        if process.exit_code != 0:
            return WORKER_OPERATION_FAILED.nudge(output=process.id)
        worktree = self.worktrees.worker_worktree(operation.worker_id)
        if operation.name.is_handoff and worktree is not None:
            task = self.queries.query(Task).find(worktree.task_id)
            if task.state is TaskState.STARTED:
                return WORKER_OPERATION_NEXT.nudge(task=task.id, output=process.id)
            if self.proof_queue.tests_pending(worktree):
                return WORKER_OPERATION_TESTS.nudge(task=task.id, output=process.id)
        if operation.name is WorkerOperationName.MERGE and worktree is not None:
            return WORKER_OPERATION_CONFLICT.nudge(worker=operation.worker_id, output=process.id)
        return operation.name.finished_nudge(operation.worker_id, process.id)
