from argparse import ArgumentParser, Namespace

from core.base.subcommand.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.waits.wait import Wait
from core.modules.waits.wait_open import WaitOpen
from core.modules.waits.wait_type import WaitType


class WaitOnSubcommand(Subcommand[WaitOpen, Wait]):
    """`journal wait on <focus> --target <table:id> ...`: the agent waits on rows it does not control, until they resolve."""

    cli_name = "wait"
    name = "on"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("focus")
        parser.add_argument("--target", action="append", default=[])

    def command(self, arguments: Namespace, caller: Caller) -> WaitOpen:
        return WaitOpen(WaitType.ROWS, arguments.focus, tuple(arguments.target))
