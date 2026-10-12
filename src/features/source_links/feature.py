from events.resources import ResourceCreated
from expects import Given, Nudged, Unchanged, WHEN
from framework.base import Feature
from features.plans.resource import Plan
from features.source_links.details import SourceLinksDetails
from features.source_links.handlers import NameUncitedSource
from framework.journal import Journal
from resources.base import AGENT, USER
from resources.types import AgentRow, Report, Todo


AGENT_ROW = AgentRow(n=1, title="claude-1")
READ_JUST_NOW = Report(n=2, title="What the audit found", seen=[AGENT], updated=WHEN - 60)
READ_LONG_AGO = Report(n=2, title="What the audit found", seen=[AGENT], updated=WHEN - 3600)
NOT_READ = Report(n=2, title="What the audit found", seen=[USER], updated=WHEN - 60)


def built(kind: str, actor: str = AGENT) -> ResourceCreated:
    return ResourceCreated(n=1, type=kind, action="created", actor=actor)


class SourceLinks(Feature):
    details = SourceLinksDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(NameUncitedSource(), expects=[
            Given(built("plan"), rows=[Plan(n=1, title="Ship it"), READ_JUST_NOW, AGENT_ROW]) >> Nudged("uncited"),
            Given(built("plan"), rows=[Plan(n=1, title="Ship it", refs=["report:2"]), READ_JUST_NOW, AGENT_ROW]) >> Unchanged(),
            Given(built("plan"), rows=[Plan(n=1, title="Ship it"), READ_LONG_AGO, AGENT_ROW]) >> Unchanged(),
            Given(built("plan"), rows=[Plan(n=1, title="Ship it"), NOT_READ, AGENT_ROW]) >> Unchanged(),
            Given(built("plan", USER), rows=[Plan(n=1, title="Ship it"), READ_JUST_NOW, AGENT_ROW]) >> Unchanged(),
            Given(built("todo"), rows=[Todo(n=1, title="Row"), READ_JUST_NOW, AGENT_ROW]) >> Unchanged(),
            Given(built("plan"), rows=[Plan(n=1, title="Ship it"), READ_JUST_NOW]) >> Unchanged(),
            Given(built("plan"), rows=[Plan(n=1, title="Ship it"), AGENT_ROW]) >> Unchanged(),
        ])
