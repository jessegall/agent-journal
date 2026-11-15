from core.modules.drivers.support.rule_effect import RuleEffect
from core.modules.waits.rules.work_ends_wait_rule import WorkEndsWaitRule


class WorkEndsWaitEffect(RuleEffect):
    """The effect of WorkEndsWaitRule, as today's rule runs it."""

    rule = WorkEndsWaitRule
