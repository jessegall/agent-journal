from events.agents import AgentMessageSent
from expects import Given, Nudged, Unchanged
from framework.base import Feature
from resources.types import AgentRow, Notice
from framework.journal import Journal
from features.pinned_links.details import PinnedLinksDetails
from features.pinned_links.handlers import RemindToPinLinks


AGENT_ROW = AgentRow(n=1, title="claude-1")


def said(text: str) -> AgentMessageSent:
    return AgentMessageSent(agent=1, text=text, turn="t1")


class PinnedLinks(Feature):
    details = PinnedLinksDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(RemindToPinLinks(), expects=[
            Given(said("The design is at https://example.com/design."), rows=[AGENT_ROW]) >> Nudged("unpinned"),
            Given(said("The design is at https://example.com/design."), rows=[AGENT_ROW, Notice(n=2, title="Design", data={"link": "https://example.com/design"})]) >> Unchanged(),
            Given(said("Open http://localhost:8421/ to see it."), rows=[AGENT_ROW]) >> Unchanged(),
            Given(said("The pull request is https://github.com/acme/app/pull/12"), rows=[AGENT_ROW]) >> Unchanged(),
            Given(said("Nothing to link here."), rows=[AGENT_ROW]) >> Unchanged(),
        ])
