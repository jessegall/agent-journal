from core.base.driver.rule_history_key import RuleHistoryKey
from core.base.timestamp import Timestamp


class HookHistory:
    """What the journal remembers of a rule for an agent and layer: whether it has control again, an overlay
    having silenced it the last time it was due, and when it last answered with lines or a refusal. With no
    module keeping a history, no rule ever regains control or has answered."""

    def regained_control(self, key: RuleHistoryKey) -> bool:
        return False

    def answer_time(self, key: RuleHistoryKey) -> Timestamp | None:
        return None
