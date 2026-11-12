from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.drivers.commands.allow_essential_rule.allow_essential_rule import AllowEssentialRule
from core.modules.settings.models.setting import Setting


class AllowEssentialRuleSubcommand(Subcommand[AllowEssentialRule, Setting]):
    """`journal driver allow-essential <rule>`: a user allows a rule its module marks essential."""

    cli_name = "driver"
    name = "allow-essential"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("rule")

    def command(self, arguments: Namespace, caller: Caller) -> AllowEssentialRule:
        return AllowEssentialRule(arguments.rule)
