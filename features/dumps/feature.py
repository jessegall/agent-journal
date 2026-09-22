import features.dumps.controller  # noqa: F401
from features.base import Feature
from features.dumps.details import DumpsDetails
from features.dumps.handlers import PromptFiling, TranscriptToDump
from features.journal import Journal


class DumpsFeature(Feature):
    details = DumpsDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(PromptFiling())
        journal.events.handler(TranscriptToDump())
