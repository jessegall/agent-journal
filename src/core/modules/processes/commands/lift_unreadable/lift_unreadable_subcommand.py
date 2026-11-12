from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.processes.commands.lift_unreadable.lift_unreadable import LiftUnreadable
from core.modules.processes.models.unreadable_mark import UnreadableMark


class LiftUnreadableSubcommand(Subcommand[LiftUnreadable, UnreadableMark]):
    """`journal reader readable "<leading words>"`: lifts the mark of a command, so its runs are asked for a reader again."""

    cli_name = "reader"
    name = "readable"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("words", help="the leading words the command was marked by")

    def command(self, arguments: Namespace, caller: Caller) -> LiftUnreadable:
        return LiftUnreadable(arguments.words)
