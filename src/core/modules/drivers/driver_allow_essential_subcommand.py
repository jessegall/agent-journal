from argparse import ArgumentParser, Namespace

from core.base.subcommand.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.drivers.driver_allow_essential import DriverAllowEssential
from core.modules.settings.setting import Setting


class DriverAllowEssentialSubcommand(Subcommand[DriverAllowEssential, Setting]):
    """`journal driver allow-essential <rule>`: a person allows a rule its module marks essential."""

    cli_name = "driver"
    name = "allow-essential"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("rule")

    def command(self, arguments: Namespace, caller: Caller) -> DriverAllowEssential:
        return DriverAllowEssential(arguments.rule)
