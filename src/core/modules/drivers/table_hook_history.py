from core.base.driver.hook_history import HookHistory
from core.base.query.queries import Queries
from core.base.timestamp import Timestamp
from core.modules.drivers.rule_history import RuleHistory
from core.modules.drivers.rule_sighting import RuleSighting


class TableHookHistory(HookHistory):
    """Reads the rule history table: whether a rule with history was silenced for a layer the last time it was due,
    and when it last spoke."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def regained_control(self, agent_id: int, rule: str, layer: str) -> bool:
        history = self.history(agent_id, rule, layer)
        return history is not None and history.last_seen == RuleSighting.SILENCED

    def last_spoke_at(self, agent_id: int, rule: str, layer: str) -> Timestamp | None:
        history = self.history(agent_id, rule, layer)
        return history.last_spoke_at if history is not None else None

    def history(self, agent_id: int, rule: str, layer: str) -> RuleHistory | None:
        rows = self.queries.query(RuleHistory).filter(agent_id=agent_id, rule=rule, layer=layer).page(1, 1).rows
        return rows[0] if rows else None
