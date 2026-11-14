from collections.abc import Mapping, Sequence

from engine.query.queries import Queries
from core.modules.assignments.models.assignment import Assignment
from core.modules.assignments.support.assignment_reason import AssignmentReason
from core.modules.assignments.support.assignment_reasons import AssignmentReasons
from core.modules.tasks.models.task import Task

ASSIGNMENTS_REASON = "the assignments of every task shown are read in one query"


class TaskAssignmentReasons:
    """Why the tasks shown were given to their assignees, keyed by task id; a task given for no stated reason has
    none."""

    def __init__(self, queries: Queries, reasons: AssignmentReasons) -> None:
        self.queries, self.reasons = queries, reasons

    def task_reasons(self, task_ids: Sequence[int]) -> Mapping[int, AssignmentReason]:
        if not task_ids:
            return {}
        given = list(self.queries.query(Assignment).filter(subject_model=Task.model_name).where_in("subject_id", list(task_ids)).every_row(ASSIGNMENTS_REASON))
        reasons = self.reasons.reasons(given)
        return {assignment.subject_id: reasons[assignment.id] for assignment in given if assignment.id in reasons}
