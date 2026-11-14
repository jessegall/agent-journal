from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.conditions.conjunction import Conjunction
from engine.query.conditions.disjunction import Disjunction
from engine.query.conditions.column_compare import ColumnCompare
from engine.query.conditions.equal import Equal
from engine.query.conditions.exists import Exists
from engine.query.select import Select
from core.modules.documents.references.row_ref import RowRef


# Matches a link whose either end is the row of the given model the id column names.
def references_plan(model: str, id_column: str) -> Disjunction:
    return Disjunction([Conjunction([Equal("source_model", model), ColumnCompare("source_id", "=", id_column)]), Conjunction([Equal("target_model", model), ColumnCompare("target_id", "=", id_column)])])


@dataclass(frozen=True)
class ExcludesPlan:
    """Excludes the tasks and phases belonging to a plan."""

    reference: RowRef

    def statement(self) -> Statement:
        tasks = Select("plan_tasks").matching(Equal("plan_id", self.reference.row_id)).matching(references_plan("task", "task_id"))
        phases = Select("phases").matching(Equal("plan_id", self.reference.row_id)).matching(references_plan("phase", "phases.id"))
        return Conjunction([Exists(tasks, negated=True), Exists(phases, negated=True)]).statement()
