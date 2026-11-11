from engine.driver.agent_hook import AgentHook
from engine.driver.seconds import Seconds
from engine.driver.rule_history_key import RuleHistoryKey
from engine.time.timestamp import Timestamp


class HookHistory:
    """What the journal remembers of a rule for an agent and layer: whether it has control again, an overlay
    having silenced it the last time it was due, and when it last answered with lines or a refusal. With no
    module keeping a history, no rule's control ever returns and no rule has answered."""

    def control_return(self, key: RuleHistoryKey) -> bool:
        return False

    def answer_time(self, key: RuleHistoryKey) -> Timestamp | None:
        return None

    def last_answer(self, rule_name: str, hook: AgentHook) -> Timestamp | None:
        return self.answer_time(RuleHistoryKey(hook.agent_id, rule_name, hook.layer_ref))

    def has_answer_after(self, rule_name: str, hook: AgentHook, start_at: Timestamp) -> bool:
        answered_at = self.last_answer(rule_name, hook)
        return answered_at is not None and answered_at >= start_at

    def has_recent_answer(self, rule_name: str, hook: AgentHook, span: Seconds) -> bool:
        answered_at = self.last_answer(rule_name, hook)
        return answered_at is not None and answered_at.elapsed_seconds(hook.timestamp) < span.count

    def row(self, key: RuleHistoryKey) -> object | None:
        return None

    def clear(self) -> None:
        return None
