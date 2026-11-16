from suites.coding.modules.workers.types.worker import Worker
from engine.cli.row_numbers import RowNumbers
from engine.driver.agent_message import AgentMessage
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.process import Process
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.enums.task_state import TaskState
from suites.coding.modules.workers.models.enums.worker_operation_name import WorkerOperationName
from suites.coding.modules.workers.agent_messages.worker_operation_next_message import WorkerOperationNextMessage
from suites.coding.modules.workers.agent_messages.worker_operation_tests_message import WorkerOperationTestsMessage
from suites.coding.modules.workers.agent_messages.worker_operation_conflict_message import WorkerOperationConflictMessage
from suites.coding.modules.workers.agent_messages.worker_operation_paused_message import WorkerOperationPausedMessage
from suites.coding.modules.workers.agent_messages.worker_operation_updated_message import WorkerOperationUpdatedMessage
from suites.coding.modules.workers.agent_messages.worker_operation_update_conflict_message import WorkerOperationUpdateConflictMessage
from suites.coding.modules.workers.agent_messages.worker_operation_update_failed_message import WorkerOperationUpdateFailedMessage
from suites.coding.modules.workers.models.enums.update_result import UpdateResult
from suites.coding.modules.workers.support.worker_proof_queue import WorkerProofQueue
from engine.query.queries import Queries
from engine.repository.repository import Repository
from suites.coding.modules.workers.models.worker_operation import WorkerOperation
from suites.coding.modules.workers.agent_messages.worker_operation_unstarted_message import WorkerOperationUnstartedMessage
from suites.coding.modules.workers.agent_messages.worker_operation_failed_message import WorkerOperationFailedMessage
from core.modules.processes.events.process_ended import ProcessEnded
from engine.listener.save_listener import SaveListener
from engine.scope.actor_scope import ActorScope
from core.modules.agents.support.agent_rows import AgentRows
from engine.driver.message_sender import MessageSender
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_job import WORKER_JOB_SOURCE
from suites.coding.modules.workers.agent_messages.worker_run_ended_message import WorkerRunEndedMessage
from suites.coding.modules.workers.support.worker_stop import WorkerStop
from engine.command.context import Context
from core.modules.agents.support.agent_number_messages import AgentNumberMessages


class WorkerRunEndedListener(SaveListener[ProcessEnded]):
    """A worker that has stopped while a run of its own went on in the background is told when the run
    ends, by a job line, which starts it again on its session; one a user or another agent stopped, or
    that asked for help after the run started, stays stopped."""

    name = "workers.run-ended"
    disabled_scopes = [ActorScope]

    def __init__(self, agents: AgentRows, worktrees: WorktreeQuery, message_sender: MessageSender, stop: WorkerStop, queries: Queries, repository: Repository, proof_queue: WorkerProofQueue, numbers: RowNumbers) -> None:
        self.numbers = numbers
        self.queries, self.repository, self.proof_queue = queries, repository, proof_queue
        self.agents, self.worktrees, self.message_sender, self.stop = agents, worktrees, message_sender, stop

    def handle(self, event: ProcessEnded, context: Context) -> None:
        process = event.row
        operation = self.queries.query(WorkerOperation).filter(process_id=process.id).first()
        if operation is not None:
            if operation.ended_at is None:
                self.repository.update(operation, context, ended_at=context.timestamp)
                self.message_sender.send_agent_message(operation.recipient_id, self.operation_agent_message(operation, process), WORKER_JOB_SOURCE, context)
            return
        agent = self.agents.find(process.session_agent_id)
        if agent.role != Worker.key or agent.ended_at is None:
            return
        worktree = self.worktrees.worker_worktree(agent.id)
        if worktree is None or worktree.state is not WorktreeState.CUT:
            return
        if self.stop.was_stopped(agent) or self.stop.has_help_request_opened_after(agent.id, process.started_at or process.creation_timestamp()):
            return
        self.message_sender.send(agent.id, WorkerRunEndedMessage.declared(), WORKER_JOB_SOURCE, context, output=process.id)

    def operation_agent_message(self, operation: WorkerOperation, process: Process) -> AgentMessage:
        if operation.started_at is None and process.state is ProcessState.ORPHANED:
            return WorkerOperationUnstartedMessage.declared().agent_message(output=process.id)
        if operation.name is WorkerOperationName.UPDATE:
            return self.update_agent_message(operation, process)
        if process.exit_code != 0:
            return WorkerOperationFailedMessage.declared().agent_message(output=process.id)
        worktree = self.worktrees.worker_worktree(operation.worker_id)
        if operation.name.is_handoff and worktree is not None:
            task = self.queries.query(Task).find(worktree.task_id)
            if task.state is TaskState.STARTED:
                return WorkerOperationNextMessage.declared().agent_message(task=task.id, output=process.id)
            if self.proof_queue.tests_pending(worktree):
                return WorkerOperationTestsMessage.declared().agent_message(task=task.id, output=process.id)
        if operation.name is WorkerOperationName.MERGE and self.is_unmerged(worktree, process):
            return AgentNumberMessages.message(self.numbers, WorkerOperationConflictMessage, "worker", operation.worker_id, output=process.id)
        if operation.name is WorkerOperationName.JOB and self.agents.find(operation.worker_id).paused_at is not None:
            return AgentNumberMessages.message(self.numbers, WorkerOperationPausedMessage, "worker", operation.worker_id)
        return operation.name.finished_agent_message(self.numbers.agent_number(operation.worker_id), process.id)

    def update_agent_message(self, operation: WorkerOperation, process: Process) -> AgentMessage:
        worker = self.numbers.agent_number(operation.worker_id)
        if operation.update_outcome is UpdateResult.CONFLICTS:
            return WorkerOperationUpdateConflictMessage.declared().agent_message(worker=worker, output=process.id)
        if operation.update_outcome is None or process.exit_code != 0:
            return WorkerOperationUpdateFailedMessage.declared().agent_message(worker=worker, output=process.id)
        return WorkerOperationUpdatedMessage.declared().agent_message(worker=worker, output=process.id)

    def is_unmerged(self, worktree: Worktree | None, process: Process) -> bool:
        return worktree is not None and not self.worktrees.has_merge(worktree.session_agent_id, process.creation_timestamp())
