from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.developer.commands.record_mark_motion.record_mark_motion import RecordMarkMotion
from core.modules.developer.support.mark_motion_file import MarkMotionFile


class RecordMarkMotionHandler(Handler[RecordMarkMotion, None]):
    """Adds the recordings to the file of mark motions."""

    command = RecordMarkMotion

    def __init__(self, recordings: MarkMotionFile) -> None:
        self.recordings = recordings

    def handle(self, command: RecordMarkMotion, context: Context) -> None:
        self.recordings.add_all(command.recordings)
