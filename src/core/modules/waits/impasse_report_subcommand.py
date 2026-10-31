from argparse import ArgumentParser, Namespace

from core.base.subcommand.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.waits.wait import Wait
from core.modules.waits.wait_open import WaitOpen
from core.modules.waits.wait_type import WaitType


class ImpasseReportSubcommand(Subcommand[WaitOpen, Wait]):
    """`journal wait stuck <why>`: the agent reports it is stuck; it is told nothing until it works again."""

    cli_name = "wait"
    name = "stuck"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("focus")

    def command(self, arguments: Namespace, caller: Caller) -> WaitOpen:
        return WaitOpen(WaitType.IMPASSE, arguments.focus)
