from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.library.library_ref import LibraryRef
from core.base.refusal import Refusal
from core.modules.sequences.commands.move_sequence_run.move_sequence_run import MoveSequenceRun
from core.modules.sequences.commands.move_sequence_run.run_move_subcommand import RunMoveSubcommand


class RunSequenceSubcommand(RunMoveSubcommand):
    """`journal sequence run <n>`: the agent starts working through a sequence at its first step."""

    action = "start"
    name = "run"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("id", type=LibraryRef.row_id)

    def command(self, arguments: Namespace, caller: Caller) -> MoveSequenceRun:
        if isinstance(arguments.id, LibraryRef):
            raise Refusal(f"sequence library:{arguments.id.item_id} is an item of the library, not a sequence of this journal", f"get it first with journal library get sequence {arguments.id.item_id}")
        return MoveSequenceRun(self.action, arguments.id)
