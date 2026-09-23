from engine.events import FileEdited
from features.base import Feature
from features.file_feed.details import FileFeedDetails
from features.file_feed.feed import noted
from features.journal import Journal
from features.parts import AgentContext, Handler


class KeepEdits(Handler):
    def handle(self, context: AgentContext, event: FileEdited) -> None:
        noted(context.record, event)


class FileFeed(Feature):
    details = FileFeedDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(KeepEdits())
