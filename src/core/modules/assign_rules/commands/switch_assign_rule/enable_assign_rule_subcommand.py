from core.modules.assign_rules.commands.switch_assign_rule.switch_assign_rule_subcommand import SwitchAssignRuleSubcommand


class EnableAssignRuleSubcommand(SwitchAssignRuleSubcommand):
    """`journal assign-rule enable <rule>`: turns a rule on; only a person may."""

    enabled = True
    name = "enable"
