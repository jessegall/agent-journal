from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.conditions.all_of import AllOf
from engine.query.conditions.any_of import AnyOf
from engine.query.conditions.column_compare import ColumnCompare
from engine.query.conditions.equal import Equal
from engine.query.conditions.exists import Exists
from engine.query.select import Select
from core.modules.documents.references.row_ref import RowRef


# Matches a link whose either end is the row of the given model the id column names.
def touches(model: str, id_column: str) -> AnyOf:
    return AnyOf([AllOf([Equal("source_model", model), ColumnCompare("source_id", "=", id_column)]), AllOf([Equal("target_model", model), ColumnCompare("target_id", "=", id_column)])])


@dataclass(frozen=True)
class ExcludesPlan:
    """Excludes the tasks and phases belonging to a plan."""

    reference: RowRef

    def statement(self) -> Statement:
        tasks = Select("plan_tasks").matching(Equal("plan_id", self.reference.row_id)).matching(touches("task", "task_id"))
        phases = Select("phases").matching(Equal("plan_id", self.reference.row_id)).matching(touches("phase", "phases.id"))
        return AllOf([Exists(tasks, negated=True), Exists(phases, negated=True)]).statement()
