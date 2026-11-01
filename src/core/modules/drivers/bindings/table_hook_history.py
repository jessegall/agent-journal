from core.base.driver.hook_history import HookHistory
from core.base.driver.rule_history_key import RuleHistoryKey
from core.base.query.queries import Queries
from core.base.timestamp import Timestamp
from core.modules.drivers.models.rule_history import RuleHistory
from core.modules.drivers.models.enums.rule_due_outcome import RuleDueOutcome


class TableHookHistory(HookHistory):
    """Reads the rule history table: whether a rule with history was silenced for a layer the last time it was due,
    and when it last answered; each row is read once, and kept until the hook's histories are written."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries
        self.kept: dict[RuleHistoryKey, RuleHistory | None] = {}

    def forget(self) -> None:
        self.kept.clear()

    def control_return(self, key: RuleHistoryKey) -> bool:
        history = self.history(key)
        return history is not None and history.last_due_outcome == RuleDueOutcome.SILENCED

    def answer_time(self, key: RuleHistoryKey) -> Timestamp | None:
        history = self.history(key)
        return history.last_answer_at if history is not None else None

    def row(self, key: RuleHistoryKey) -> RuleHistory | None:
        return self.history(key)

    def history(self, key: RuleHistoryKey) -> RuleHistory | None:
        if key not in self.kept:
            rows = self.queries.query(RuleHistory).filter(agent_id=key.agent_id, rule=key.rule, layer=key.layer).page(1, 1).rows
            self.kept[key] = rows[0] if rows else None
        return self.kept[key]
