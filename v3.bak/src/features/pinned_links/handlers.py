from events import Fact
from events.pinned_links import LinkUnpinned
from features.pinned_links.details import UNPINNED
from receiving import Handler
from serving import Chat


class RemindToPinTheLink(Handler[LinkUnpinned]):
    def handle(self, event: LinkUnpinned, chat: Chat) -> list[Fact]:
        chat.nudge(UNPINNED, url=event.url)
        return []
