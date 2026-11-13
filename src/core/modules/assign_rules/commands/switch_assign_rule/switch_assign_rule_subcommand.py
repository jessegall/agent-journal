from argparse import ArgumentParser, Namespace
from typing import ClassVar

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.assign_rules.support.rule_arguments import RuleArguments
from core.modules.assign_rules.commands.switch_assign_rule.switch_assign_rule import SwitchAssignRule
from core.modules.assign_rules.models.assign_rule import AssignRule


class SwitchAssignRuleSubcommand(Subcommand[SwitchAssignRule, AssignRule]):
    """The line that turns one rule on or off, as each subclass says; only a person may."""

    enabled: ClassVar[bool]
    cli_name = "assign-rule"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("rule_id", type=int)
        RuleArguments.add_revision(parser)

    def command(self, arguments: Namespace, caller: Caller) -> SwitchAssignRule:
        return SwitchAssignRule(arguments.rule_id, enabled=self.enabled, revision=arguments.revision)
