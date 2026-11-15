from core.modules.drivers.support.rule_need_source import RuleNeedSource
from core.modules.tasks.rules.unlogged_write_rule import UnloggedWriteRule


class UnloggedWriteNeeds(RuleNeedSource):
    """Plans the block of the fiftieth write since the task in hand was last logged, as today's UnloggedWriteRule opens it."""

    rule = UnloggedWriteRule
    rank = "tasks.unlogged-writes"
