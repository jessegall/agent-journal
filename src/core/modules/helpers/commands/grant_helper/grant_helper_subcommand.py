from argparse import REMAINDER, ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.helpers.commands.grant_helper.grant_helper import GrantHelper
from core.modules.helpers.models.helper_grant import HelperGrant


class GrantHelperSubcommand(Subcommand[GrantHelper, HelperGrant]):
    """`journal helper grant <n> <program> <subcommands> [<arguments and values>]`, alternatives split by a bar."""

    cli_name = "helper"
    name = "grant"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("helper_id", type=int)
        parser.add_argument("program")
        parser.add_argument("subcommands")
        parser.add_argument("allowed_arguments", nargs=REMAINDER)

    def command(self, arguments: Namespace, caller: Caller) -> GrantHelper:
        return GrantHelper(arguments.helper_id, arguments.program, arguments.subcommands, "".join(arguments.allowed_arguments))
