from core.modules.assign_rules.commands.switch_assign_rule.switch_assign_rule_subcommand import SwitchAssignRuleSubcommand


class DisableAssignRuleSubcommand(SwitchAssignRuleSubcommand):
    """`journal assign-rule disable <rule>`: turns a rule off and keeps it; only a person may."""

    enabled = False
    name = "disable"
