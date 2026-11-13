from collections.abc import Mapping, Sequence

from engine.query.queries import Queries
from core.modules.assign_rules.models.assign_rule import AssignRule
from core.modules.assign_rules.support.rule_conditions import RuleConditions
from core.modules.assign_rules.support.rule_mark import RuleMark
from core.modules.assignments.models.assignment import Assignment
from core.modules.assignments.support.assignment_reason import AssignmentReason
from core.modules.assignments.support.assignment_reasons import AssignmentReasons

RULES_REASON = "the rules named on the assignments asked about are read in one query"
RULES_TABLE = "assign_rules"


class RuleAssignmentReasons(AssignmentReasons):
    """Names the rule that gave each assignment and its conditions, 'by rule 4: complexity is at least 4', or
    'by rule 4 (deleted)' once the rule is gone."""

    def __init__(self, queries: Queries, conditions: RuleConditions) -> None:
        self.queries, self.conditions = queries, conditions

    def reasons(self, assignments: Sequence[Assignment]) -> Mapping[int, AssignmentReason]:
        marks = {assignment.id: RuleMark.read(assignment.metadata) for assignment in assignments}
        rule_ids = sorted({mark.rule_id for mark in marks.values() if mark is not None})
        if not rule_ids:
            return {}
        rules = list(self.queries.query(AssignRule).where_in("id", rule_ids).every_row(RULES_REASON))
        lines = self.conditions.lines_by_rule(rules)
        found = {rule.id: AssignmentReason(f"by rule {rule.id}: {', '.join(line.label for line in lines[rule.id])}", f"{RULES_TABLE}:{rule.id}") for rule in rules}
        return {assignment_id: found.get(mark.rule_id, AssignmentReason(f"by rule {mark.rule_id} (deleted)", None)) for assignment_id, mark in marks.items() if mark is not None}
