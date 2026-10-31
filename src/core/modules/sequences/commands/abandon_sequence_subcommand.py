from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.modules.sequences.commands.move_sequence_run import MoveSequenceRun
from core.modules.sequences.commands.support.run_move_subcommand import RunMoveSubcommand


class AbandonSequenceSubcommand(RunMoveSubcommand):
    """`journal sequence abandon --why "<reason>" [--sure]`: names the steps left undone, and gives the run
    up with --sure."""

    action = "abandon"
    name = "abandon"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--why", required=True)
        parser.add_argument("--sure", action="store_true")

    def command(self, arguments: Namespace, caller: Caller) -> MoveSequenceRun:
        return MoveSequenceRun(self.action, reason=arguments.why, sure=arguments.sure)
