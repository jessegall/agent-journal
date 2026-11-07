from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.developer.commands.record_mark_motion.record_mark_motion import RecordMarkMotion


class RecordMarkMotionSubcommand(Subcommand[RecordMarkMotion, None]):
    """`journal developer record-mark-motion <frames>`: the viewer keeps one recording of a mark's motion."""

    cli_name = "developer"
    name = "record-mark-motion"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("frames")

    def command(self, arguments: Namespace, caller: Caller) -> RecordMarkMotion:
        return RecordMarkMotion(arguments.frames)
