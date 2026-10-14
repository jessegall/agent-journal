from events import Fact
from events.agents import TurnStopped
from events.update_reports import CommitFirstSeen, OfferHeldBack, UpdateOffered
from features.update_reports.gather import UPDATE
from receiving import Listener
from resources.base import USER
from resources.types import Report
from serving import Clock, ReadElsewhere, ReadRows

COMMITS = "close_from_commits"
OFFERED = "update-offered"
OFFER_EVERY = 3600


def unread(reports: ReadRows[Report]) -> bool:
    return any(r.data.get("kind") == UPDATE and not r.data.get("dismissed") and USER not in r.seen for r in reports.rows.standing())


class SpotCommitToOffer(Listener[TurnStopped]):
    def listen(self, event: TurnStopped, elsewhere: ReadElsewhere, reports: ReadRows[Report], clock: Clock) -> list[Fact]:
        here = elsewhere.here()
        commit = here.cursor(COMMITS)
        seen, _, at = here.cursor(OFFERED).partition(" ")
        if not commit or commit == seen:
            return []
        if not seen:
            return [CommitFirstSeen(commit=commit)]
        if clock.now() - float(at) < OFFER_EVERY or unread(reports):
            return [OfferHeldBack(commit=commit, at=at)]
        return [UpdateOffered(commit=commit).once(f"offer|{commit}")]
