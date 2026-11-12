from engine.cli.row_numbers import RowNumbers
from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.driver.nudge import Nudge
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.process import Process
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.enums.task_state import TaskState
from suites.coding.modules.workers.models.enums.worker_operation_name import (WorkerOperationName, WORKER_OPERATION_NEXT, WORKER_OPERATION_TESTS, WORKER_OPERATION_CONFLICT, WORKER_OPERATION_PAUSED,
                                                                             WORKER_OPERATION_UPDATED, WORKER_OPERATION_UPDATE_CONFLICT, WORKER_OPERATION_UPDATE_FAILED)
from suites.coding.modules.workers.models.enums.update_result import UpdateResult
from suites.coding.modules.workers.support.worker_proof_queue import WorkerProofQueue
from engine.query.queries import Queries
from engine.repository.repository import Repository
from suites.coding.modules.workers.models.worker_operation import WorkerOperation
from suites.coding.modules.workers.support.worker_nudges import WORKER_OPERATION_UNSTARTED, WORKER_OPERATION_FAILED
from core.modules.processes.events.process_ended import ProcessEnded
from suites.coding.models.enums.coding_helper_role import CodingHelperRole
from engine.listener.save_listener import SaveListener
from engine.scope.actor_scope import ActorScope
from core.modules.agents.support.agent_rows import AgentRows
from engine.driver.nudger import Nudger
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_job import WORKER_JOB_SOURCE
from suites.coding.modules.workers.support.worker_nudges import WORKER_RUN_ENDED
from suites.coding.modules.workers.support.worker_stop import WorkerStop
from engine.command.context import Context


class WorkerRunEndedListener(SaveListener[ProcessEnded]):
    """A worker that has stopped while a run of its own went on in the background is told when the run
    ends, by a job line, which starts it again on its session; one a person or another agent stopped, or
    that asked for help after the run started, stays stopped."""

    name = "workers.run-ended"
    disabled_scopes = [ActorScope]

    def __init__(self, agents: AgentRows, worktrees: WorktreeQuery, nudger: Nudger, stop: WorkerStop, queries: Queries, repository: Repository, proof_queue: WorkerProofQueue, numbers: RowNumbers) -> None:
        self.numbers = numbers
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
        if self.stop.was_stopped(agent) or self.stop.has_help_request_opened_after(agent.id, process.started_at or process.creation_timestamp()):
            return
        self.nudger.send(agent.id, WORKER_RUN_ENDED, WORKER_JOB_SOURCE, context, output=process.id)

    def operation_nudge(self, operation: WorkerOperation, process: Process) -> Nudge:
        if operation.started_at is None and process.state is ProcessState.ORPHANED:
            return WORKER_OPERATION_UNSTARTED.nudge(output=process.id)
        if operation.name is WorkerOperationName.UPDATE:
            return self.update_nudge(operation, process)
        if process.exit_code != 0:
            return WORKER_OPERATION_FAILED.nudge(output=process.id)
        worktree = self.worktrees.worker_worktree(operation.worker_id)
        if operation.name.is_handoff and worktree is not None:
            task = self.queries.query(Task).find(worktree.task_id)
            if task.state is TaskState.STARTED:
                return WORKER_OPERATION_NEXT.nudge(task=task.id, output=process.id)
            if self.proof_queue.tests_pending(worktree):
                return WORKER_OPERATION_TESTS.nudge(task=task.id, output=process.id)
        if operation.name is WorkerOperationName.MERGE and self.is_unmerged(worktree, process):
            return WORKER_OPERATION_CONFLICT.nudge(worker=self.numbers.number(AGENT_MODEL_NAME, operation.worker_id), output=process.id)
        if operation.name is WorkerOperationName.JOB and self.agents.find(operation.worker_id).paused_at is not None:
            return WORKER_OPERATION_PAUSED.nudge(worker=self.numbers.number(AGENT_MODEL_NAME, operation.worker_id))
        return operation.name.finished_nudge(self.numbers.number(AGENT_MODEL_NAME, operation.worker_id), process.id)

    def update_nudge(self, operation: WorkerOperation, process: Process) -> Nudge:
        worker = self.numbers.number(AGENT_MODEL_NAME, operation.worker_id)
        if operation.update_result is UpdateResult.CONFLICTS:
            return WORKER_OPERATION_UPDATE_CONFLICT.nudge(worker=worker, output=process.id)
        if operation.update_result is None or process.exit_code != 0:
            return WORKER_OPERATION_UPDATE_FAILED.nudge(worker=worker, output=process.id)
        return WORKER_OPERATION_UPDATED.nudge(worker=worker, output=process.id)

    def is_unmerged(self, worktree: Worktree | None, process: Process) -> bool:
        return worktree is not None and not self.worktrees.has_merge(worktree.session_agent_id, process.creation_timestamp())
