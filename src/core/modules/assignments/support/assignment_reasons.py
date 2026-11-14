from collections.abc import Mapping, Sequence

from core.modules.assignments.models.assignment import Assignment
from core.modules.assignments.support.assignment_reason import AssignmentReason


class AssignmentReasons:
    """Says why assignments were made, keyed by assignment id; answered by a module that makes assignments for a
    reason of its own, and empty without one."""

    def reasons(self, assignments: Sequence[Assignment]) -> Mapping[int, AssignmentReason]:
        return {}
