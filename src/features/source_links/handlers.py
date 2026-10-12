from events import Fact
from events.source_links import SourceUncited
from receiving import Handler
from serving import Chat


class NameUncitedSource(Handler[SourceUncited]):
    def handle(self, event: SourceUncited, chat: Chat) -> list[Fact]:
        chat.nudge("uncited", type=event.type, n=event.n, read=event.read)
        return []
