from argparse import ArgumentParser, Namespace

from core.base.subcommand.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.drivers.choose_driver import ChooseDriver
from core.modules.settings.setting import Setting


class ChooseDriverSubcommand(Subcommand[ChooseDriver, Setting]):
    """`journal driver choose <driver> --environment <name>`: the driver of its role in the environment from now on."""

    cli_name = "driver"
    name = "choose"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("driver")

    def command(self, arguments: Namespace, caller: Caller) -> ChooseDriver:
        return ChooseDriver(arguments.driver)
