from engine.rule_backed.rule_policy import RulePolicy
from core.modules.drivers.rules.panic_file_rule import PanicFileRule


class PanicFilePolicy(RulePolicy):
    """The refusal of PanicFileRule, with today's text, as a policy of the new driver."""

    rule = PanicFileRule
    rank = "safety.all"
    is_safety = True
    grant_types = []
