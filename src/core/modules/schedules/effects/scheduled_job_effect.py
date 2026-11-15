from core.modules.drivers.support.rule_effect import RuleEffect
from core.modules.schedules.rules.scheduled_job_rule import ScheduledJobRule


class ScheduledJobEffect(RuleEffect):
    """The effect of ScheduledJobRule, as today's rule runs it."""

    rule = ScheduledJobRule
