from argparse import ArgumentParser, Namespace

from core.base.subcommand.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.drivers.suite_choose import SuiteChoose
from core.modules.settings.setting import Setting


class SuiteChooseSubcommand(Subcommand[SuiteChoose, Setting]):
    """`journal suite choose <suite> --environment <name>`: the suite the environment runs from now on."""

    cli_name = "suite"
    name = "choose"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("suite")

    def command(self, arguments: Namespace, caller: Caller) -> SuiteChoose:
        return SuiteChoose(arguments.suite)
