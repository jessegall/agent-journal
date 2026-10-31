from argparse import ArgumentParser, Namespace
from typing import ClassVar

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.sequences.commands.move_sequence_run import MoveSequenceRun
from core.modules.sequences.commands.support.sequence_line import SequenceLine


class RunMoveSubcommand(Subcommand[MoveSequenceRun, SequenceLine]):
    """What `journal sequence follow`, `next` and `abandon` share: they move the calling agent's run and
    print its line."""

    action: ClassVar[str]
    cli_name = "sequence"

    def arguments(self, parser: ArgumentParser) -> None:
        return

    def command(self, arguments: Namespace, caller: Caller) -> MoveSequenceRun:
        return MoveSequenceRun(self.action)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, SequenceLine):
            output.line(value.text)
