from engine.rule_backed.rule_effect import RuleEffect
from core.modules.tasks.rules.unopenable_block_rule import UnopenableBlockRule


class BlockReviewEffect(RuleEffect):
    """The effect that records a round of the blocked tasks' reminder, as today's UnopenableBlockRule runs it."""

    rule = UnopenableBlockRule
