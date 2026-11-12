from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.processes.commands.mark_unreadable.mark_unreadable import MarkUnreadable
from core.modules.processes.models.unreadable_mark import UnreadableMark


class MarkUnreadableSubcommand(Subcommand[MarkUnreadable, UnreadableMark]):
    """`journal reader unreadable "<leading words>" --reason "<why>"`: marks a command whose output no reader can read."""

    cli_name = "reader"
    name = "unreadable"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("words", help="the leading words of the command, such as make watch")
        parser.add_argument("--reason", required=True, help="why no reader can read its output, in at least three words")

    def command(self, arguments: Namespace, caller: Caller) -> MarkUnreadable:
        return MarkUnreadable(arguments.words, arguments.reason)
