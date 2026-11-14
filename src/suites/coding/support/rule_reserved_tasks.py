from collections.abc import Sequence

from core.modules.assign_rules.support.rule_mark import RuleMark
from core.modules.assignments.support.assignments import Assignments
from core.modules.tasks.models.task import Task


class RuleReservedTasks:
    """Picks, of the tasks reserved for an agent, those an assign rule gave it: its assignment names the rule."""

    def __init__(self, assignments: Assignments) -> None:
        self.assignments = assignments

    def given(self, tasks: Sequence[Task], agent_id: int) -> tuple[Task, ...]:
        return tuple(task for task in tasks if any(assignment.actor_id == agent_id and RuleMark.read(assignment.metadata) is not None for assignment in self.assignments.assignments(task)))
