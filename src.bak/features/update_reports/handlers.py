from events import Fact
from events.update_reports import CommitFirstSeen, OfferHeldBack, UpdateOffered
from features.update_reports.listeners import OFFERED
from receiving import Handler
from serving import Chat, Clock, Elsewhere

OFFER = "offer"


class MarkFirstCommit(Handler[CommitFirstSeen]):
    def handle(self, event: CommitFirstSeen, elsewhere: Elsewhere, clock: Clock) -> list[Fact]:
        elsewhere.here().keep_cursor(OFFERED, f"{event.commit} {clock.now()}")
        return []


class HoldOfferBack(Handler[OfferHeldBack]):
    def handle(self, event: OfferHeldBack, elsewhere: Elsewhere) -> list[Fact]:
        elsewhere.here().keep_cursor(OFFERED, f"{event.commit} {event.at}")
        return []


class OfferAnUpdate(Handler[UpdateOffered]):
    def handle(self, event: UpdateOffered, elsewhere: Elsewhere, clock: Clock, chat: Chat) -> list[Fact]:
        elsewhere.here().keep_cursor(OFFERED, f"{event.commit} {clock.now()}")
        chat.say(OFFER)
        return []
