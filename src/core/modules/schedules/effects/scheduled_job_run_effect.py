from core.modules.drivers.support.rule_effect import RuleEffect
from core.modules.schedules.rules.scheduled_job_run_rule import ScheduledJobRunRule


class ScheduledJobRunEffect(RuleEffect):
    """The effect of ScheduledJobRunRule, as today's rule runs it."""

    rule = ScheduledJobRunRule
