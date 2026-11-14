from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.render_value import render_value
from engine.subcommand.subcommand import Subcommand
from core.modules.assign_rules.commands.delete_assign_rule.return_rule_tasks import ReturnRuleTasks
from core.modules.assign_rules.support.rule_arguments import RuleArguments
from core.modules.assign_rules.support.rule_tasks.rule_task_list import RuleTaskList


class ReturnRuleTasksSubcommand(Subcommand[ReturnRuleTasks, RuleTaskList]):
    """`journal assign-rule give-back <rule> [--change]`: gives back the unstarted tasks
    a rule gave, also a deleted rule's; only a person may."""

    cli_name = "assign-rule"
    name = "give-back"

    def arguments(self, parser: ArgumentParser) -> None:
        RuleArguments.add_revised_rule(parser)

    def command(self, arguments: Namespace, caller: Caller) -> ReturnRuleTasks:
        return ReturnRuleTasks(rule_id=arguments.rule_id, is_confirmed=arguments.is_confirmed, revision=arguments.revision)

    def write_output(self, value: object, output: Output) -> None:
        render_value(value, output)
