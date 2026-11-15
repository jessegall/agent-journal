from core.modules.drivers.support.rule_policy import RulePolicy
from core.modules.helpers.rules.start_names_model_rule import StartNamesModelRule


class StartNamesModelPolicy(RulePolicy):
    """The refusal of StartNamesModelRule, with today's text, as a policy of the new driver."""

    rule = StartNamesModelRule
    rank = "helpers.policies"
