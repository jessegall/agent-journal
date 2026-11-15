from engine.rule_backed.rule_policy import RulePolicy
from core.modules.claude_code.rules.native_memory_rule import NativeMemoryRule


class NativeMemoryPolicy(RulePolicy):
    """The refusal of NativeMemoryRule, with today's text, as a policy of the new driver."""

    rule = NativeMemoryRule
    rank = "safety.all"
    is_safety = True
    grant_types = []
