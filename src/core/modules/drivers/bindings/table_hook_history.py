from core.base.driver.hook_history import HookHistory
from core.base.driver.rule_history_key import RuleHistoryKey
from core.base.query.queries import Queries
from core.base.timestamp import Timestamp
from core.modules.drivers.models.rule_history import RuleHistory
from core.modules.drivers.models.enums.rule_due_outcome import RuleDueOutcome


class TableHookHistory(HookHistory):
    """Reads the rule history table: whether a rule with history was silenced for a layer the last time it was
    due, and when it last answered; an agent's rows of a layer are read once, and kept until the hook's
    histories are written."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries
        self.kept: dict[RuleHistoryKey, RuleHistory] = {}
        self.layers_read: set[tuple[int, str]] = set()

    def clear(self) -> None:
        self.kept.clear()
        self.layers_read.clear()

    def control_return(self, key: RuleHistoryKey) -> bool:
        history = self.history(key)
        return history is not None and history.last_due_outcome == RuleDueOutcome.SILENCED

    def answer_time(self, key: RuleHistoryKey) -> Timestamp | None:
        history = self.history(key)
        return history.last_answer_at if history is not None else None

    def row(self, key: RuleHistoryKey) -> RuleHistory | None:
        return self.history(key)

    def history(self, key: RuleHistoryKey) -> RuleHistory | None:
        if (key.agent_id, key.layer) not in self.layers_read:
            self.layers_read.add((key.agent_id, key.layer))
            rows = self.queries.query(RuleHistory).filter(session_agent_id=key.agent_id, layer=key.layer).all_rows()
            self.kept.update({RuleHistoryKey(key.agent_id, row.rule, key.layer): row for row in rows})
        return self.kept.get(key)
