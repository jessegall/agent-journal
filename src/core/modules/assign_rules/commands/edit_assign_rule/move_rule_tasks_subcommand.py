from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.cli.write_flags import WriteFlags
from engine.subcommand.output import Output
from engine.subcommand.render_value import render_value
from engine.subcommand.subcommand import Subcommand
from core.modules.assign_rules.commands.edit_assign_rule.move_rule_tasks import MoveRuleTasks
from core.modules.assign_rules.support.rule_arguments import RuleArguments
from core.modules.assign_rules.support.rule_tasks.rule_task_list import RuleTaskList


class MoveRuleTasksSubcommand(Subcommand[MoveRuleTasks, RuleTaskList]):
    """`journal assign-rule reassign <rule> [--confirm]`: moves the unstarted tasks a
    rule gave to its new target; only a person may."""

    cli_name = "assign-rule"
    name = "reassign"

    def __init__(self, flags: WriteFlags) -> None:
        self.flags = flags

    def arguments(self, parser: ArgumentParser) -> None:
        RuleArguments.add_revised_rule(parser)

    def command(self, arguments: Namespace, caller: Caller) -> MoveRuleTasks:
        return MoveRuleTasks(rule_id=arguments.rule_id, is_confirmed=self.flags.consume_short_flag(arguments, "confirm"), revision=arguments.revision)

    def write_output(self, value: object, output: Output) -> None:
        render_value(value, output)
