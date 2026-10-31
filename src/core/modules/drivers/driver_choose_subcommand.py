from argparse import ArgumentParser, Namespace

from core.base.subcommand.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.drivers.driver_choose import DriverChoose
from core.modules.settings.setting import Setting


class DriverChooseSubcommand(Subcommand[DriverChoose, Setting]):
    """`journal driver choose <driver> --environment <name>`: the driver of its role in the environment from now on."""

    cli_name = "driver"
    name = "choose"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("driver")

    def command(self, arguments: Namespace, caller: Caller) -> DriverChoose:
        return DriverChoose(arguments.driver)
