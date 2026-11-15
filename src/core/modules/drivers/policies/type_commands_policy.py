from engine.rule_backed.rule_policy import RulePolicy
from core.modules.drivers.rules.type_commands_rule import TypeCommandsRule


class TypeCommandsPolicy(RulePolicy):
    """The refusal of TypeCommandsRule, with today's text, as a policy of the new driver."""

    rule = TypeCommandsRule
    rank = "access.all"
