from events.agents import AgentMessageSent
from events.pinned_links import LinkUnpinned
from expects import Dispatches, Given, Nudged, nothing
from framework.base import Feature
from resources.types import AgentRow, Notice
from framework.journal import Journal
from features.pinned_links.details import UNPINNED, PinnedLinksDetails
from features.pinned_links.handlers import RemindToPinTheLink
from features.pinned_links.listeners import SpotUnpinnedLinks


AGENT_ROW = AgentRow(n=1, title="claude-1")
DESIGN = "https://example.com/design"


def said(text: str) -> AgentMessageSent:
    return AgentMessageSent(agent=1, text=text, turn="t1")


class PinnedLinks(Feature):
    details = PinnedLinksDetails

    def register(self, journal: Journal) -> None:
        journal.events.listen(AgentMessageSent, SpotUnpinnedLinks(), expects=[
            Given(said(f"The design is at {DESIGN}."), rows=[AGENT_ROW]) >> Dispatches(LinkUnpinned(agent=1, url=DESIGN).once(f"unpinned|{DESIGN}")),
            Given(said(f"The design is at {DESIGN}."), rows=[AGENT_ROW, Notice(n=2, title="Design", data={"link": DESIGN})]) >> Dispatches(nothing),
            Given(said("Open http://localhost:8421/ to see it."), rows=[AGENT_ROW]) >> Dispatches(nothing),
            Given(said("The pull request is https://github.com/acme/app/pull/12"), rows=[AGENT_ROW]) >> Dispatches(nothing),
            Given(said("Nothing to link here."), rows=[AGENT_ROW]) >> Dispatches(nothing),
        ])
        journal.events.handle(LinkUnpinned, RemindToPinTheLink(), expects=[
            Given(LinkUnpinned(agent=1, url=DESIGN), rows=[AGENT_ROW]) >> Nudged(UNPINNED, url=DESIGN),
        ])
