from collections.abc import Mapping

from core.base.query.queries import Queries
from core.modules.drivers.models.rule_history import RuleHistory


class HookRuleHistories:
    """The rule history rows of an agent, read once for the whole hook, for every layer: the rules ask what
    they remember from them and the writer saves its changes against them. They are dropped when the hook's
    histories are written."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries
        self.agent_histories: dict[int, dict[tuple[str, str], RuleHistory]] = {}

    def rows(self, agent_id: int) -> Mapping[tuple[str, str], RuleHistory]:
        if agent_id not in self.agent_histories:
            self.agent_histories[agent_id] = {(row.rule, row.layer): row for row in self.queries.query(RuleHistory).filter(session_agent_id=agent_id).all_rows()}
        return self.agent_histories[agent_id]

    def clear(self) -> None:
        self.agent_histories.clear()
