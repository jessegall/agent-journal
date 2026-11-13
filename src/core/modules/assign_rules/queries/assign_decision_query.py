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


class AssignDecisionQuery(Query[AssignDecision]):
    """Reads what the rules decided, by rule: the tasks each gave since a time, whether a rule ever matched, and the
    reason a rule was last skipped. A task's one decision is updated in place, so its time is when it was decided."""

    def __init__(self, database: Database, tables: Tables) -> None:
        super().__init__(database, tables, AssignDecision)

    def given_since(self, since: Timestamp) -> dict[int, int]:
        counts = self.filter(outcome=DecisionOutcome.ASSIGNED).matching(Greater(DECIDED_COLUMN, since.text)).group_by(RULE_COLUMN).count_by()
        return {int(rule_id): count for rule_id, count in counts.items() if isinstance(rule_id, int)}

    def matched_rule_ids(self, rule_ids: Sequence[int]) -> set[int]:
        return {int(rule_id) for rule_id in self.matching(Among(RULE_COLUMN, rule_ids)).group_by(RULE_COLUMN).count_by() if isinstance(rule_id, int)}

    def last_skips(self) -> dict[int, str]:
        skips: dict[int, str] = {}
        for decision in self.filter(outcome=DecisionOutcome.SKIPPED).newest().take(NEWEST_SKIPS):
            if decision.rule_id is not None:
                skips.setdefault(decision.rule_id, decision.reason)
        return skips
