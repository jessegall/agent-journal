from core.modules.drivers.support.rule_line_source import RuleLineSource
from core.modules.triggers.rules.phrase_trigger_rule import PhraseTriggerRule


class PhraseTriggerLines(RuleLineSource):
    """The lines of PhraseTriggerRule, in today's words."""

    rule = PhraseTriggerRule
