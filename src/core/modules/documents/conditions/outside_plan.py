from dataclasses import dataclass

from core.base.database.statement import Statement
from core.modules.documents.references.row_ref import RowRef


@dataclass(frozen=True)
class OutsidePlan:
    """Excludes the tasks and phases belonging to a plan."""

    reference: RowRef

    def statement(self) -> Statement:
        return Statement("""NOT EXISTS (SELECT 1 FROM plan_tasks WHERE plan_id = ? AND
            ((source_model = 'task' AND source_id = task_id) OR (target_model = 'task' AND target_id = task_id)))
            AND NOT EXISTS (SELECT 1 FROM phases WHERE plan_id = ? AND
            ((source_model = 'phase' AND source_id = phases.id) OR (target_model = 'phase' AND target_id = phases.id)))""",
                         (self.reference.row_id, self.reference.row_id))
