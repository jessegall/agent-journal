from engine.rule_backed.rule_policy import RulePolicy
from core.modules.aliases.rules.unknown_command_rule import UnknownCommandRule


class UnknownCommandPolicy(RulePolicy):
    """The refusal of UnknownCommandRule, with today's text, as a policy of the new driver."""

    rule = UnknownCommandRule
    rank = "shell.all"
