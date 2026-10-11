from engine.events.agents import SessionStarted
from engine.events.resources import WorkCreated
from expects import Given, Nudged, Unchanged
from features.base import Feature
from features.templates.resource import Template
from resources.base import AGENT
from resources.types import AgentRow, Todo, Work
from features.journal import Journal
from features.templates.applying import ApplyTemplate, CheckTemplate
from features.templates.instructions import PrefaceShow, TellAgainOnSessionStart, TellOnStart
from features.templates.controller import Templates
from features.templates.details import TemplatesDetails

__all__ = ["Templates"]


AGENT_ROW = AgentRow(n=1, title="claude-1")
BUG_FIX = Template(n=2, title="Bug fix", brief="Reproduce it first, then fix it.")
BLANK = Template(n=2, title="Bug fix")
TEMPLATED = Todo(n=5, title="Fix the crash", data={"template": 2})
STARTED = WorkCreated(n=3, type="work", action="created", actor=AGENT)


def work_on(todo: int = 5) -> Work:
    return Work(n=3, title="Fix the crash", data={"todo": todo})


class TemplatesFeature(Feature):
    details = TemplatesDetails

    def register(self, journal: Journal) -> None:
        journal.commands.intercept("create", CheckTemplate())
        journal.events.handler(ApplyTemplate())
        journal.commands.intercept("show", PrefaceShow())
        journal.events.handler(TellOnStart(), expects=[
            Given(STARTED, rows=[BUG_FIX, TEMPLATED, work_on(), AGENT_ROW]) >> Nudged("instructions"),
            Given(STARTED, rows=[BUG_FIX, Todo(n=5, title="Fix the crash"), work_on(), AGENT_ROW]) >> Unchanged(),
            Given(STARTED, rows=[BUG_FIX, TEMPLATED, work_on(todo=0), AGENT_ROW]) >> Unchanged(),
            Given(STARTED, rows=[BLANK, TEMPLATED, work_on(), AGENT_ROW]) >> Unchanged(),
            Given(STARTED, rows=[BUG_FIX, TEMPLATED, work_on()]) >> Unchanged(),
        ])
        journal.events.handler(TellAgainOnSessionStart(), expects=[
            Given(SessionStarted(agent=1), rows=[BUG_FIX, TEMPLATED, work_on(), AGENT_ROW]) >> Nudged("instructions"),
            Given(SessionStarted(agent=1), rows=[BUG_FIX, TEMPLATED, AGENT_ROW]) >> Unchanged(),
            Given(SessionStarted(agent=1), rows=[BUG_FIX, Todo(n=5, title="Fix the crash"), work_on(), AGENT_ROW]) >> Unchanged(),
        ])
