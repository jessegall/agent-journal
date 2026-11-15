from core.modules.drivers.support.rule_policy import RulePolicy
from core.modules.drivers.rules.database_file_rule import DatabaseFileRule


class DatabaseFilePolicy(RulePolicy):
    """The refusal of DatabaseFileRule, with today's text, as a policy of the new driver."""

    rule = DatabaseFileRule
    rank = "safety.all"
    is_safety = True
    grant_types = []
