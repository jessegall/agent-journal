from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.render_value import render_value
from engine.subcommand.subcommand import Subcommand
from core.modules.assign_rules.commands.record_assign_decision.apply_assign_rule import ApplyAssignRule
from core.modules.assign_rules.support.rule_arguments import RuleArguments
from core.modules.assign_rules.support.rule_tasks.rule_task_list import RuleTaskList


class ApplyAssignRuleSubcommand(Subcommand[ApplyAssignRule, RuleTaskList]):
    """`journal assign-rule apply <rule> [--change]`: applies a rule to the free tasks
    waiting now; only a person may."""

    cli_name = "assign-rule"
    name = "apply"

    def arguments(self, parser: ArgumentParser) -> None:
        RuleArguments.add_revised_rule(parser)

    def command(self, arguments: Namespace, caller: Caller) -> ApplyAssignRule:
        return ApplyAssignRule(rule_id=arguments.rule_id, is_confirmed=arguments.is_confirmed, revision=arguments.revision)

    def write_output(self, value: object, output: Output) -> None:
        render_value(value, output)
