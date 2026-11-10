from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.project_rules.commands.make_rule.make_rule import MakeRule
from core.modules.project_rules.models.project_rule import ProjectRule


class MakeRuleSubcommand(Subcommand[MakeRule, ProjectRule]):
    """`journal rule make "<text>"`: a rule for the whole project; an agent's waits for a person's approval."""

    cli_name = "rule"
    name = "make"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("text")

    def command(self, arguments: Namespace, caller: Caller) -> MakeRule:
        return MakeRule(arguments.text)
