from engine.events.agents import SessionStarted
from engine.events.resources import ResourceCreated, WorkCreated
from expects import Given, Nudged, Unchanged, Updated
from features.base import Feature
from features.templates.resource import Template
from resources.base import AGENT, USER
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

REPRODUCE = Template(n=2, title="Bug fix", brief="Reproduce it first.", sections=[{"title": "Steps", "body": "Reproduce it in {{app}}"}],
                     data={"fields": [{"name": "app", "label": "App", "kind": "text", "default": "the app"}]})


def created(todo: Todo) -> Given:
    return Given(ResourceCreated(n=5, type="todo", action="created", actor=USER), rows=[REPRODUCE, todo])


def work_on(todo: int = 5) -> Work:
    return Work(n=3, title="Fix the crash", data={"todo": todo})


class TemplatesFeature(Feature):
    details = TemplatesDetails

    def register(self, journal: Journal) -> None:
        journal.commands.intercept("create", CheckTemplate())
        journal.events.handler(ApplyTemplate(), expects=[
            created(Todo(n=5, title="Fix the crash", data={"template": 2, "template_values": {"app": "the viewer"}})) >> Updated(Todo(n=5), sections=[{"title": "Steps", "body": "Reproduce it in the viewer"}]),
            created(Todo(n=5, title="Fix the crash", data={"template": 2})) >> Updated(Todo(n=5), sections=[{"title": "Steps", "body": "Reproduce it in the app"}]),
            created(Todo(n=5, title="Fix the crash")) >> Unchanged(),
        ])
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
