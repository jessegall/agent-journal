from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.modules.sequences.commands.move_sequence_run import MoveSequenceRun
from core.modules.sequences.commands.support.run_move_subcommand import RunMoveSubcommand


class RunSequenceSubcommand(RunMoveSubcommand):
    """`journal sequence run <n>`: the agent starts working through a sequence at its first step."""

    action = "start"
    name = "run"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> MoveSequenceRun:
        return MoveSequenceRun(self.action, arguments.id)
