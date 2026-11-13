from collections.abc import Sequence

from engine.database.database import Database
from engine.model.tables import Tables
from engine.query.conditions.among import Among
from engine.query.conditions.greater import Greater
from engine.query.query import Query
from engine.time.timestamp import Timestamp
from core.modules.assign_rules.models.assign_decision import AssignDecision
from core.modules.assign_rules.models.enums.decision_outcome import DecisionOutcome

RULE_COLUMN = "rule_id"
DECIDED_COLUMN = "updated_at"
NEWEST_SKIPS = 200
WAITING_REASON = "the Assign tab names each target's oldest unstarted task a rule gave it"


class AssignDecisionQuery(Query[AssignDecision]):
    """Reads what the rules decided, by rule: the tasks each assigned after a time, whether a rule ever
    matched, and the reason a rule was last skipped. A task's one decision is updated in place, so its time
    is when it was decided."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, AssignDecision)

    def assigned_counts(self, start: Timestamp) -> dict[int, int]:
        counts = self.filter(outcome=DecisionOutcome.ASSIGNED).matching(Greater(DECIDED_COLUMN, start.text)).group_by(RULE_COLUMN).count_by()
        return {int(rule_id): count for rule_id, count in counts.items() if isinstance(rule_id, int)}

    def matched_rule_ids(self, rule_ids: Sequence[int]) -> set[int]:
        return {int(rule_id) for rule_id in self.matching(Among(RULE_COLUMN, rule_ids)).group_by(RULE_COLUMN).count_by() if isinstance(rule_id, int)}

    def retried_task_ids(self, most: int) -> list[int]:
        return [decision.task_id for decision in self.filter(outcome=DecisionOutcome.SKIPPED).where_not_null(RULE_COLUMN).oldest().take(most)]

    def oldest_given(self, open_task_ids: Query) -> dict[int, int]:
        oldest: dict[int, int] = {}
        for decision in self.filter(outcome=DecisionOutcome.ASSIGNED).where_in("task_id", open_task_ids).every_row(WAITING_REASON):
            if decision.actor_id is not None:
                oldest[decision.actor_id] = min(oldest.get(decision.actor_id, decision.task_id), decision.task_id)
        return oldest

    def last_skips(self) -> dict[int, str]:
        skips: dict[int, str] = {}
        for decision in self.filter(outcome=DecisionOutcome.SKIPPED).descending(DECIDED_COLUMN).take(NEWEST_SKIPS):
            if decision.rule_id is not None:
                skips.setdefault(decision.rule_id, decision.reason)
        return skips
