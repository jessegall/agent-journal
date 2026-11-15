from core.modules.drivers.support.rule_need_source import RuleNeedSource
from core.modules.triggers.rules.phrase_trigger_rule import PhraseTriggerRule


class PhraseTriggerNeeds(RuleNeedSource):
    """The block PhraseTriggerRule opens, planned for the new driver as today's rule opens it."""

    rule = PhraseTriggerRule
    rank = "triggers.skill"
