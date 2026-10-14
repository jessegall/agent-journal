from events import Fact
from events.row_links import AmbiguousFileNamed
from features.row_links.details import AMBIGUOUS
from receiving import Handler
from serving import Chat


class NameAmbiguousFiles(Handler[AmbiguousFileNamed]):
    def handle(self, event: AmbiguousFileNamed, chat: Chat) -> list[Fact]:
        chat.nudge(AMBIGUOUS, name=event.name, count=event.count, paths=event.paths)
        return []
