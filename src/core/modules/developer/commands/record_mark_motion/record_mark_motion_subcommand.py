from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.developer.commands.record_mark_motion.record_mark_motion import RecordMarkMotion


class RecordMarkMotionSubcommand(Subcommand[RecordMarkMotion, None]):
    """`journal developer record-mark-motion <recordings>`: the viewer keeps the recordings of its marks'
    motion, a JSON array."""

    cli_name = "developer"
    name = "record-mark-motion"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("recordings")

    def command(self, arguments: Namespace, caller: Caller) -> RecordMarkMotion:
        return RecordMarkMotion(arguments.recordings)
