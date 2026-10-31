from core.base.driver.hook_history import HookHistory
from core.base.query.queries import Queries
from core.modules.drivers.rule_history import RuleHistory
from core.modules.drivers.rule_sighting import RuleSighting


class TableHookHistory(HookHistory):
    """Reads from the rule history table whether a rule with history was silenced for a layer the last time it was due."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def regained_control(self, agent_id: int, rule: str, layer: str) -> bool:
        rows = self.queries.query(RuleHistory).filter(agent_id=agent_id, rule=rule, layer=layer).page(1, 1).rows
        return bool(rows) and rows[0].last_seen == RuleSighting.SILENCED
