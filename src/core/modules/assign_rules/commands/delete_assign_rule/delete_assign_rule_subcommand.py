from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.assign_rules.commands.delete_assign_rule.delete_assign_rule import DeleteAssignRule
from core.modules.assign_rules.support.rule_arguments import RuleArguments


class DeleteAssignRuleSubcommand(Subcommand[DeleteAssignRule, None]):
    """`journal assign-rule delete <rule>`: deletes a rule; only a person may."""

    cli_name = "assign-rule"
    name = "delete"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("row_id", type=int)
        RuleArguments.add_revision(parser)

    def command(self, arguments: Namespace, caller: Caller) -> DeleteAssignRule:
        return DeleteAssignRule(row_id=arguments.row_id, revision=arguments.revision)

    def write_output(self, value: object, output: Output) -> None:
        output.line(output.confirmation or "the rule is deleted")
