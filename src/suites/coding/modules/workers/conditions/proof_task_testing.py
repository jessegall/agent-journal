from engine.database.statement import Statement
from core.modules.tasks.models.enums.task_state import TaskState
from engine.query.conditions.equal import Equal
from engine.query.conditions.column_compare import ColumnCompare
from engine.query.select import Select
from engine.query.conditions.exists import Exists


class ProofTaskTesting:
    """Matches proofs whose task is ready for checking."""

    def statement(self) -> Statement:
        return Exists(Select("tasks").matching(ColumnCompare("tasks.id", "=", "proofs.task_id")).matching(Equal("tasks.state", TaskState.TESTING))).statement()
