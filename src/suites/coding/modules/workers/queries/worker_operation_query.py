from engine.query.conditions.less import Less
from engine.query.conditions.is_null import IsNull
from engine.database.database import Database
from engine.database.kept_rows import KeptRows
from engine.model.tables import Tables
from engine.query.conditions.minimum import Minimum
from engine.query.query import Query
from engine.time.timestamp import Timestamp
from engine.errors.refusal import Refusal
from suites.coding.modules.workers.models.worker_operation import WorkerOperation
from core.modules.agents.support.agent_label import AgentLabel
from engine.cli.row_numbers import RowNumbers


class WorkerOperationQuery(Query[WorkerOperation]):
    """Finds the command currently using a worker's worktree."""

    def __init__(self, database: Database, tables: Tables, kept: KeptRows, numbers: RowNumbers) -> None:
        self.numbers = numbers
        super().__init__(database, tables, WorkerOperation)
        self.kept = kept

    def active(self, worker_id: int) -> WorkerOperation | None:
        return self.kept.scoped_current(lambda: self.filter(worker_id=worker_id).matching(IsNull("ended_at")).first(),
                                        name=f"workers.active_operation:{worker_id}")

    def ended_after(self, worker_id: int, cutoff: Timestamp) -> bool:
        return self.filter(worker_id=worker_id).matching(Minimum("ended_at", cutoff.text)).exists()

    def runs_prior(self, worker_id: int, process_id: int) -> bool:
        return self.filter(worker_id=worker_id).matching(IsNull("ended_at")).matching(Less("process_id", process_id)).exists()

    def check_available(self, worker_id: int, process_id: int | None = None) -> None:
        operation = self.active(worker_id)
        if operation is not None and operation.process_id != process_id:
            raise Refusal(f"{AgentLabel.from_row_id(worker_id, self.numbers, "worker").text} has a command running in output {operation.process_id}",
                          f"wait for it to end: journal output read {operation.process_id} --summary")
