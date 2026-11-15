from core.modules.drivers.support.rule_line_source import RuleLineSource
from core.modules.tasks.rules.unopenable_block_rule import UnopenableBlockRule


class BlockReviewLines(RuleLineSource):
    """The lines of the tasks the agent blocked by hand, in today's words of UnopenableBlockRule."""

    rule = UnopenableBlockRule
