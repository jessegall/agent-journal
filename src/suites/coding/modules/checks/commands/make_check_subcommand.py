from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from suites.coding.modules.checks.commands.make_check import MakeCheck
from suites.coding.modules.checks.commands.support.check_line_subcommand import CheckLineSubcommand


class MakeCheckSubcommand(CheckLineSubcommand[MakeCheck]):
    """`journal check make "<title>" --command "<command>" [--brief "<why>"] [--every <minutes>]`."""

    cli_name = "check"
    name = "make"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("title")
        parser.add_argument("--command", required=True)
        parser.add_argument("--brief", default="")
        parser.add_argument("--every", type=int, default=0)

    def command(self, arguments: Namespace, caller: Caller) -> MakeCheck:
        return MakeCheck(arguments.title, arguments.command, arguments.brief, arguments.every)
