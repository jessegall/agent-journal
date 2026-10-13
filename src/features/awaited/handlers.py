from events import Fact
from events.awaited import WaitEnded
from receiving import Handler
from resources.types import Work
from serving import Chat, Rows


class HandBackTheResults(Handler[WaitEnded]):
    def handle(self, event: WaitEnded, works: Rows[Work], chat: Chat) -> list[Fact]:
        works.section(event.work, f"{event.count + 1} · back", f"{event.awaiting} came back: {event.results}")
        works.update(event.work, awaiting="", awaiting_on="")
        chat.say("returned", results=event.results, n=event.work)
        return []
