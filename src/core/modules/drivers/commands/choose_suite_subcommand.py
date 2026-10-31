from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.drivers.commands.choose_suite import ChooseSuite
from core.modules.settings.models.setting import Setting


class ChooseSuiteSubcommand(Subcommand[ChooseSuite, Setting]):
    """`journal suite choose <suite> --environment <name>`: the suite the environment runs from now on."""

    cli_name = "suite"
    name = "choose"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("suite")

    def command(self, arguments: Namespace, caller: Caller) -> ChooseSuite:
        return ChooseSuite(arguments.suite)
