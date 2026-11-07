from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.base.scope.actor_scope import ActorScope
from core.modules.processes.models.enums.process_state import RUNNING_STATES
from core.modules.processes.models.process import Process
from suites.coding.modules.workers.commands.run_worker_operation.claim_worker_operation import ClaimWorkerOperation
from suites.coding.modules.workers.models.worker_operation import WorkerOperation


class ClaimWorkerOperationHandler(Handler[ClaimWorkerOperation, WorkerOperation]):
    """Claims an accepted command once, before its slow work begins."""

    command = ClaimWorkerOperation
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: ClaimWorkerOperation, context: Context) -> WorkerOperation:
        operation = self.queries.query(WorkerOperation).filter(worker_id=command.worker_id, process_id=command.process_id).first()
        process = self.queries.query(Process).find(command.process_id)
        if operation is None or process.session_agent_id != context.actor.id:
            raise Refusal("only the queued process runs this worker command")
        if operation.started_at is not None or operation.ended_at is not None or process.state not in RUNNING_STATES:
            raise Refusal(f"worker command in output {process.id} already started or ended")
        if process.queued_at is not None:
            raise Refusal(f"worker command in output {process.id} is waiting for its process queue slot")
        return self.repository.update(operation, context, started_at=context.timestamp)
