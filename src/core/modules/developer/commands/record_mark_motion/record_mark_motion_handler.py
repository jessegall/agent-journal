from core.base.command.context import Context
from core.base.command.handler import Handler
from core.modules.developer.commands.record_mark_motion.record_mark_motion import RecordMarkMotion
from core.modules.developer.support.mark_motion_file import MarkMotionFile


class RecordMarkMotionHandler(Handler[RecordMarkMotion, None]):
    """Adds one recording to the file of mark motions."""

    command = RecordMarkMotion

    def __init__(self, recordings: MarkMotionFile) -> None:
        self.recordings = recordings

    def handle(self, command: RecordMarkMotion, context: Context) -> None:
        self.recordings.add(command.frames)
