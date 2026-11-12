from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.processes.commands.lift_run_unreadable.lift_run_unreadable import LiftRunUnreadable
from core.modules.processes.models.unreadable_mark import UnreadableMark


class LiftRunUnreadableSubcommand(Subcommand[LiftRunUnreadable, UnreadableMark]):
    """`journal output readable <n>`: lifts the mark of the command of a run, from its card."""

    cli_name = "output"
    name = "readable"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("process_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> LiftRunUnreadable:
        return LiftRunUnreadable(arguments.process_id)
