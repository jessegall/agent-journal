from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.waits.models.wait import Wait
from core.modules.waits.commands.open_wait import OpenWait
from core.modules.waits.models.enums.wait_type import WaitType


class WaitRowsSubcommand(Subcommand[OpenWait, Wait]):
    """`journal wait on <focus> --target <table:id> ...`: the agent waits on rows it does not control, until
    they resolve."""

    cli_name = "wait"
    name = "on"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("focus")
        parser.add_argument("--target", action="append", default=[])

    def command(self, arguments: Namespace, caller: Caller) -> OpenWait:
        return OpenWait(WaitType.ROWS, arguments.focus, tuple(arguments.target))
