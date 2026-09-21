from features.base import Feature
from features.context.commands import Reread
from features.context.details import ContextDetails
from features.context.handlers import DecideAtMarks, NameOwedReading, ReleaseOnceDecided
from features.journal import Journal


class Context(Feature):
    details = ContextDetails

    def register(self, journal: Journal) -> None:
        journal.commands.add("rule", Reread())
        journal.events.handler(DecideAtMarks())
        journal.events.handler(ReleaseOnceDecided())
        journal.events.handler(NameOwedReading())
