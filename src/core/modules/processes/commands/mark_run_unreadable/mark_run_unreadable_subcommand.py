from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.processes.commands.mark_run_unreadable.mark_run_unreadable import MarkRunUnreadable
from core.modules.processes.models.unreadable_mark import UnreadableMark


class MarkRunUnreadableSubcommand(Subcommand[MarkRunUnreadable, UnreadableMark]):
    """`journal output unreadable <n>`: marks the command of a run as one no reader can read, from its card."""

    cli_name = "output"
    name = "unreadable"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("process_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> MarkRunUnreadable:
        return MarkRunUnreadable(arguments.process_id)
