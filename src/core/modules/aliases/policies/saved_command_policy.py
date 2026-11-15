from core.modules.drivers.support.rule_policy import RulePolicy
from core.modules.aliases.rules.saved_command_rule import SavedCommandRule


class SavedCommandPolicy(RulePolicy):
    """The refusal of SavedCommandRule, with today's text, as a policy of the new driver."""

    rule = SavedCommandRule
    rank = "shell.all"
