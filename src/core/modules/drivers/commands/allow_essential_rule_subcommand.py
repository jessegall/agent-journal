from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.drivers.commands.allow_essential_rule import AllowEssentialRule
from core.modules.settings.models.setting import Setting


class AllowEssentialRuleSubcommand(Subcommand[AllowEssentialRule, Setting]):
    """`journal driver allow-essential <rule>`: a person allows a rule its module marks essential."""

    cli_name = "driver"
    name = "allow-essential"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("rule")

    def command(self, arguments: Namespace, caller: Caller) -> AllowEssentialRule:
        return AllowEssentialRule(arguments.rule)
