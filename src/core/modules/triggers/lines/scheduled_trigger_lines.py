from core.modules.drivers.support.rule_line_source import RuleLineSource
from core.modules.triggers.rules.scheduled_trigger_rule import ScheduledTriggerRule


class ScheduledTriggerLines(RuleLineSource):
    """The lines of ScheduledTriggerRule, in today's words."""

    rule = ScheduledTriggerRule
