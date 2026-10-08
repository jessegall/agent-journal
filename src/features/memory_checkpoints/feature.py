from features.base import Feature
from features.memory_checkpoints.commands import Reread
from features.memory_checkpoints.details import MemoryCheckpointsDetails
from features.memory_checkpoints.handlers import DecideAtMarks, DecideAtMarksOnChange, MarkWhatWasKept, ReleaseOnceDecided, owed_reading
from features.sending import Nudge
from features.journal import Journal


class MemoryCheckpoints(Feature):
    details = MemoryCheckpointsDetails
    nudges = (Nudge("reread", behaviour="rereading", about=owed_reading, private=False),)

    def register(self, journal: Journal) -> None:
        journal.commands.add("rule", Reread())
        journal.events.handler(DecideAtMarks())
        journal.events.handler(DecideAtMarksOnChange())
        journal.events.handler(ReleaseOnceDecided())
        journal.events.handler(MarkWhatWasKept())
