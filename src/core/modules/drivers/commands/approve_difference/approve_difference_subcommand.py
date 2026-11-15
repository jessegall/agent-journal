from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.drivers.commands.approve_difference.approve_difference import ApproveDifference


class ApproveDifferenceSubcommand(Subcommand[ApproveDifference, int]):
    """`journal driver approve-difference <key> --reason "<why>"`: a person approves a kind of difference as
    intended."""

    cli_name = "driver"
    name = "approve-difference"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("key")
        parser.add_argument("--reason", required=True)

    def command(self, arguments: Namespace, caller: Caller) -> ApproveDifference:
        return ApproveDifference(arguments.key, arguments.reason)
