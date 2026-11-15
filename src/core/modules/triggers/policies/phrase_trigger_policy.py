from core.modules.drivers.support.rule_policy import RulePolicy
from core.modules.triggers.rules.phrase_trigger_rule import PhraseTriggerRule


class PhraseTriggerPolicy(RulePolicy):
    """The refusal of PhraseTriggerRule, with today's text, as a policy of the new driver."""

    rule = PhraseTriggerRule
    rank = "triggers.policies"
