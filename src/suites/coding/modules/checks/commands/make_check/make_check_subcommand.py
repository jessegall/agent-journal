from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from suites.coding.modules.checks.commands.make_check.make_check import MakeCheck
from suites.coding.modules.checks.commands.support.show_check_line_subcommand import ShowCheckLineSubcommand


class MakeCheckSubcommand(ShowCheckLineSubcommand[MakeCheck]):
    """`journal check make "<title>" --command "<command>" [--brief "<why>"] [--every <minutes>]`."""

    cli_name = "check"
    name = "make"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("title")
        parser.add_argument("--command", required=True)
        parser.add_argument("--brief", default="")
        parser.add_argument("--every", type=int, default=0)

    def command(self, arguments: Namespace, caller: Caller) -> MakeCheck:
        return MakeCheck(arguments.title, arguments.command, arguments.brief, arguments.every)
