from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.assign_rules.support.rule_arguments import RuleArguments
from core.modules.assign_rules.commands.move_assign_rule.move_assign_rule import MoveAssignRule
from core.modules.assign_rules.models.assign_rule import AssignRule


class MoveAssignRuleSubcommand(Subcommand[MoveAssignRule, AssignRule]):
    """`journal assign-rule move <rule> --to <place>`: moves a rule up or down; only a person may."""

    cli_name = "assign-rule"
    name = "move"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("rule_id", type=int)
        RuleArguments.add_revision(parser)
        parser.add_argument("--to", dest="position", type=int, required=True)

    def command(self, arguments: Namespace, caller: Caller) -> MoveAssignRule:
        return MoveAssignRule(arguments.rule_id, arguments.position, arguments.revision)
