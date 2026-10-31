from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.waits.models.wait import Wait
from core.modules.waits.commands.open_wait import OpenWait
from core.modules.waits.models.enums.wait_type import WaitType


class RequestHelpSubcommand(Subcommand[OpenWait, Wait]):
    """`journal wait stuck <why>`: the agent reports it is stuck; it is told nothing until it works again."""

    cli_name = "wait"
    name = "stuck"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("focus")

    def command(self, arguments: Namespace, caller: Caller) -> OpenWait:
        return OpenWait(WaitType.HELP_REQUEST, arguments.focus)
