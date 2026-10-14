from events.resources import ResourceCreated
from expects import Dispatches, Given, Nudged, WHEN, nothing
from framework.base import Feature
from resources.plans import Plan
from features.source_links.details import SourceLinksDetails
from features.source_links.handlers import NameUncitedSource
from features.source_links.listeners import SpotUncitedSource
from events.source_links import SourceUncited
from framework.journal import Journal
from resources.base import AGENT, USER
from resources.types import AgentRow, Doc, Report, Todo


AGENT_ROW = AgentRow(n=1, title="claude-1")
READ_JUST_NOW = Report(n=2, title="What the audit found", seen=[AGENT], updated=WHEN - 60)
READ_LONG_AGO = Report(n=2, title="What the audit found", seen=[AGENT], updated=WHEN - 3600)
DOC_READ_JUST_NOW = Doc(n=3, title="What stays true", seen=[AGENT], updated=WHEN - 60)
NOT_READ = Report(n=2, title="What the audit found", seen=[USER], updated=WHEN - 60)


class SourceLinks(Feature):
    details = SourceLinksDetails

    def register(self, journal: Journal) -> None:
        journal.events.listen(ResourceCreated, SpotUncitedSource(), expects=[
            Given(ResourceCreated.of("plan"), rows=[Plan(n=1, title="Ship it"), READ_JUST_NOW, AGENT_ROW]) >> Dispatches(SourceUncited(type="plan", n=1, read="report:2")),
            Given(ResourceCreated.of("plan"), rows=[Plan(n=1, title="Ship it"), DOC_READ_JUST_NOW, AGENT_ROW]) >> Dispatches(SourceUncited(type="plan", n=1, read="doc:3")),
            Given(ResourceCreated.of("plan"), rows=[Plan(n=1, title="Ship it", refs=["report:2"]), READ_JUST_NOW, AGENT_ROW]) >> Dispatches(nothing),
            Given(ResourceCreated.of("plan"), rows=[Plan(n=1, title="Ship it"), READ_LONG_AGO, AGENT_ROW]) >> Dispatches(nothing),
            Given(ResourceCreated.of("plan"), rows=[Plan(n=1, title="Ship it"), NOT_READ, AGENT_ROW]) >> Dispatches(nothing),
            Given(ResourceCreated.of("plan", USER), rows=[Plan(n=1, title="Ship it"), READ_JUST_NOW, AGENT_ROW]) >> Dispatches(nothing),
            Given(ResourceCreated.of("todo"), rows=[Todo(n=1, title="Row"), READ_JUST_NOW, AGENT_ROW]) >> Dispatches(nothing),
            Given(ResourceCreated.of("plan"), rows=[Plan(n=1, title="Ship it"), READ_JUST_NOW]) >> Dispatches(nothing),
            Given(ResourceCreated.of("plan"), rows=[Plan(n=1, title="Ship it"), AGENT_ROW]) >> Dispatches(nothing),
            Given(ResourceCreated.of("doc"), rows=[Doc(n=1, title="New"), READ_JUST_NOW, AGENT_ROW]) >> Dispatches(SourceUncited(type="doc", n=1, read="report:2")),
            Given(ResourceCreated.of("report"), rows=[Report(n=1, title="New"), DOC_READ_JUST_NOW, AGENT_ROW]) >> Dispatches(SourceUncited(type="report", n=1, read="doc:3")),
            Given(ResourceCreated.of("doc"), rows=[Doc(n=1, title="What stays true", seen=[AGENT], updated=WHEN - 60), AGENT_ROW]) >> Dispatches(nothing),
            Given(ResourceCreated.of("plan"), rows=[Plan(n=1, title="Ship it"), AGENT_ROW, *[Report(n=n, title=f"Audit {n}", seen=[AGENT], updated=WHEN - 600 + n * 100) for n in range(2, 6)]])
                >> Dispatches(SourceUncited(type="plan", n=1, read="report:3, report:4, report:5")),
            Given(ResourceCreated.of("plan"), rows=[Plan(n=1, title="Ship it"), READ_LONG_AGO, AGENT_ROW], settings={"source_links.within": 120}) >> Dispatches(SourceUncited(type="plan", n=1, read="report:2")),
        ])
        journal.events.handle(SourceUncited, NameUncitedSource(), expects=[
            Given(SourceUncited(type="plan", n=1, read="report:2"), rows=[AGENT_ROW]) >> Nudged("uncited", type="plan", n=1, read="report:2"),
        ])
