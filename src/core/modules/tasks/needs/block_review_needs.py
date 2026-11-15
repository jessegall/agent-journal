from core.modules.drivers.support.rule_need_source import RuleNeedSource
from core.modules.tasks.rules.unopenable_block_rule import UnopenableBlockRule


class BlockReviewNeeds(RuleNeedSource):
    """Plans the block of the third reminder of tasks the agent blocked by hand, as today's UnopenableBlockRule opens it."""

    rule = UnopenableBlockRule
    rank = "tasks.blocked-review"
    agent_types = ["main"]
