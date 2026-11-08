from core.base.driver.hook_history import HookHistory
from core.base.driver.rule_history_key import RuleHistoryKey
from core.base.timestamp import Timestamp
from core.modules.drivers.models.rule_history import RuleHistory
from core.modules.drivers.models.enums.rule_due_outcome import RuleDueOutcome
from core.modules.drivers.support.hook_rule_histories import HookRuleHistories


class TableHookHistory(HookHistory):
    """Reads the rule history table: whether a rule with history was silenced for a layer the last time it was
    due, and when it last answered; an agent's rows are read once, and kept until the hook's histories are
    written."""

    def __init__(self, histories: HookRuleHistories) -> None:
        self.histories = histories

    def clear(self) -> None:
        self.histories.clear()

    def control_return(self, key: RuleHistoryKey) -> bool:
        history = self.history(key)
        return history is not None and history.last_due_outcome == RuleDueOutcome.SILENCED

    def answer_time(self, key: RuleHistoryKey) -> Timestamp | None:
        history = self.history(key)
        return history.last_answer_at if history is not None else None

    def row(self, key: RuleHistoryKey) -> RuleHistory | None:
        return self.history(key)

    def history(self, key: RuleHistoryKey) -> RuleHistory | None:
        return self.histories.of(key.agent_id).get((key.rule, key.layer))
