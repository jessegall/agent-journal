from features.base import Feature
from features.memory_checkpoints.commands import Reread
from features.memory_checkpoints.details import ContextDetails
from features.memory_checkpoints.handlers import DecideAtMarks, NameOwedReading, ReleaseOnceDecided
from features.journal import Journal


class Context(Feature):
    details = ContextDetails

    def register(self, journal: Journal) -> None:
        journal.commands.add("rule", Reread())
        journal.events.handler(DecideAtMarks())
        journal.events.handler(ReleaseOnceDecided())
        journal.events.handler(NameOwedReading())
