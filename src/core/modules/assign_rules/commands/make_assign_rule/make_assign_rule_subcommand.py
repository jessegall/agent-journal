from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.assign_rules.commands.make_assign_rule.make_assign_rule import MakeAssignRule
from core.modules.assign_rules.models.assign_rule import AssignRule
from core.modules.assign_rules.support.rule_arguments import RuleArguments


class MakeAssignRuleSubcommand(Subcommand[MakeAssignRule, AssignRule]):
    """`journal assign-rule make --target <target> --condition "<field> <operator> <value>"`: adds a rule;
    only a person may."""

    cli_name = "assign-rule"
    name = "make"

    def arguments(self, parser: ArgumentParser) -> None:
        RuleArguments.add(parser, target_required=True)
        parser.set_defaults(program="", program_model="", queue_limit=0)

    def command(self, arguments: Namespace, caller: Caller) -> MakeAssignRule:
        return MakeAssignRule(arguments.target, RuleArguments.conditions(arguments), arguments.target_agent_id, arguments.program, arguments.program_model, arguments.queue_limit, arguments.revision)
