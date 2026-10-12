from events.resources import ResourceCreated
from expects import Given, Nudged, Unchanged, WHEN
from features.base import Feature
from features.plans.resource import Plan
from features.source_links.details import SourceLinksDetails
from features.source_links.handlers import NameUncitedSource
from features.journal import Journal
from resources.base import AGENT, USER
from resources.types import AgentRow, Report, Todo


AGENT_ROW = AgentRow(n=1, title="claude-1")
READ_JUST_NOW = Report(n=2, title="What the audit found", seen=[AGENT], updated=WHEN - 60)
READ_LONG_AGO = Report(n=2, title="What the audit found", seen=[AGENT], updated=WHEN - 3600)
NOT_READ = Report(n=2, title="What the audit found", seen=[USER], updated=WHEN - 60)


class SourceLinks(Feature):
    details = SourceLinksDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(NameUncitedSource(), expects=[
            Given(ResourceCreated.of("plan"), rows=[Plan(n=1, title="Ship it"), READ_JUST_NOW, AGENT_ROW]) >> Nudged("uncited"),
            Given(ResourceCreated.of("plan"), rows=[Plan(n=1, title="Ship it", refs=["report:2"]), READ_JUST_NOW, AGENT_ROW]) >> Unchanged(),
            Given(ResourceCreated.of("plan"), rows=[Plan(n=1, title="Ship it"), READ_LONG_AGO, AGENT_ROW]) >> Unchanged(),
            Given(ResourceCreated.of("plan"), rows=[Plan(n=1, title="Ship it"), NOT_READ, AGENT_ROW]) >> Unchanged(),
            Given(ResourceCreated.of("plan", USER), rows=[Plan(n=1, title="Ship it"), READ_JUST_NOW, AGENT_ROW]) >> Unchanged(),
            Given(ResourceCreated.of("todo"), rows=[Todo(n=1, title="Row"), READ_JUST_NOW, AGENT_ROW]) >> Unchanged(),
            Given(ResourceCreated.of("plan"), rows=[Plan(n=1, title="Ship it"), READ_JUST_NOW]) >> Unchanged(),
            Given(ResourceCreated.of("plan"), rows=[Plan(n=1, title="Ship it"), AGENT_ROW]) >> Unchanged(),
        ])
