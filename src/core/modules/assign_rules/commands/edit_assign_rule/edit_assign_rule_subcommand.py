from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.assign_rules.commands.edit_assign_rule.edit_assign_rule import EditAssignRule
from core.modules.assign_rules.models.assign_rule import AssignRule
from core.modules.assign_rules.support.rule_arguments import RuleArguments


class EditAssignRuleSubcommand(Subcommand[EditAssignRule, AssignRule]):
    """`journal assign-rule edit <rule>`: changes its target, or replaces its conditions with the ones given;
    only a person may."""

    cli_name = "assign-rule"
    name = "edit"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("row_id", type=int)
        RuleArguments.add(parser, target_required=False)

    def command(self, arguments: Namespace, caller: Caller) -> EditAssignRule:
        conditions = None if arguments.conditions is None else RuleArguments.conditions(arguments)
        return EditAssignRule(row_id=arguments.row_id, target=arguments.target, agent_id=arguments.agent_id, program=arguments.program,
                              program_model=arguments.program_model, queue_limit=arguments.queue_limit, conditions=conditions, revision=arguments.revision)
