from core.base.driver.hook_history import HookHistory
from core.base.driver.rule_history_key import RuleHistoryKey
from core.base.query.queries import Queries
from core.base.timestamp import Timestamp
from core.modules.drivers.rule_history import RuleHistory
from core.modules.drivers.rule_sighting import RuleSighting


class TableHookHistory(HookHistory):
    """Reads the rule history table: whether a rule with history was silenced for a layer the last time it was due,
    and when it last answered."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def regained_control(self, key: RuleHistoryKey) -> bool:
        history = self.history(key)
        return history is not None and history.last_sighting == RuleSighting.SILENCED

    def answer_time(self, key: RuleHistoryKey) -> Timestamp | None:
        history = self.history(key)
        return history.last_answer_at if history is not None else None

    def history(self, key: RuleHistoryKey) -> RuleHistory | None:
        rows = self.queries.query(RuleHistory).filter(agent_id=key.agent_id, rule=key.rule, layer=key.layer).page(1, 1).rows
        return rows[0] if rows else None
