from engine.rule_backed.rule_policy import RulePolicy
from core.modules.aliases.rules.alias_expansion_rule import AliasExpansionRule


class AliasExpansionPolicy(RulePolicy):
    """The refusal of AliasExpansionRule, with today's text, as a policy of the new driver."""

    rule = AliasExpansionRule
    rank = "shell.all"
