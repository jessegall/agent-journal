from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from suites.coding.modules.checks.commands.edit_check.edit_check import EditCheck
from suites.coding.modules.checks.commands.support.show_check_line_subcommand import ShowCheckLineSubcommand


class EditCheckSubcommand(ShowCheckLineSubcommand[EditCheck]):
    """`journal check edit <n> [--title ...] [--command ...] [--brief ...] [--every <minutes>]`."""

    cli_name = "check"
    name = "edit"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("id", type=int)
        parser.add_argument("--title")
        parser.add_argument("--command")
        parser.add_argument("--brief")
        parser.add_argument("--every", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> EditCheck:
        return EditCheck(arguments.id, arguments.title, arguments.command, arguments.brief, arguments.every)
