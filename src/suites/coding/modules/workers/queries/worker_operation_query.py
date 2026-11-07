from core.base.query.conditions.is_null import IsNull
from core.base.database.database import Database
from core.base.model.tables import Tables
from core.base.query.query import Query
from core.base.refusal import Refusal
from suites.coding.modules.workers.models.worker_operation import WorkerOperation


class WorkerOperationQuery(Query[WorkerOperation]):
    """Finds the command currently using a worker's worktree."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, WorkerOperation)

    def active(self, worker_id: int) -> WorkerOperation | None:
        return self.filter(worker_id=worker_id).matching(IsNull("ended_at")).first()

    def check_available(self, worker_id: int, process_id: int | None = None) -> None:
        operation = self.active(worker_id)
        if operation is not None and operation.process_id != process_id:
            raise Refusal(f"worker {worker_id} has a command running in output {operation.process_id}",
                          f"wait for it to end: journal output read {operation.process_id} --summary")
