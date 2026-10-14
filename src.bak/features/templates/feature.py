from events.agents import SessionStarted
from events.asking import RowWriting
from events.resources import ResourceCreated
from events.templates import TemplateChosen, TemplateToRead
from events.works import WorkCreated
from controllers.types import Todos
from expects import Dispatches, Given, Kept, Nudged, Refused, Unchanged, Updated, nothing
from framework.base import Feature
from resources.templates import Template
from resources.base import AGENT, USER
from resources.types import AgentRow, Todo, Work
from framework.journal import Journal
from features.templates.applying import TemplateFitsTheRow
from features.templates.handlers import StartFromTheTemplate, TellTheInstructions
from features.templates.instructions import PrefaceShow
from features.templates.listeners import SpotRowFromTemplate, SpotSessionOnATemplate, SpotWorkOnATemplate
from controllers.types import Templates
from features.templates.details import TemplatesDetails

__all__ = ["Templates"]


AGENT_ROW = AgentRow(n=1, title="claude-1")
BUG_FIX = Template(n=2, title="Bug fix", brief="Reproduce it first, then fix it.")
BLANK = Template(n=2, title="Bug fix")
TEMPLATED = Todo(n=5, title="Fix the crash", data={"template": 2})
STARTED = WorkCreated(n=3, type="work", action="created", actor=AGENT)

REPRODUCE = Template(n=2, title="Bug fix", brief="Reproduce it first.", sections=[{"title": "Steps", "body": "Reproduce it in {{app}}"}],
                     data={"fields": [{"name": "app", "label": "App", "kind": "text", "default": "the app"}]})

FOR_PLANS = Template(n=2, title="Bug fix", brief="Reproduce it first.", data={"applies_to": ["plan"]})
CREATING = {"actor": AGENT}
TELL = TemplateToRead(agent=1, n=2, title="Bug fix", brief="Reproduce it first, then fix it.")
GONE = Todo(n=5, title="Fix the crash", data={"template": 9})
PADDED = Template(n=2, title="Bug fix", brief="  Reproduce it first.\n ")


def writing(**fields) -> RowWriting:
    return RowWriting(type="todo", action="create", actor=AGENT, fields=tuple(fields.items()))


def created(todo: Todo) -> Given:
    return Given(ResourceCreated(n=5, type="todo", action="created", actor=USER), rows=[REPRODUCE, todo])


def work_on(todo: int = 5) -> Work:
    return Work(n=3, title="Fix the crash", data={"todo": todo})


class TemplatesFeature(Feature):
    details = TemplatesDetails

    def register(self, journal: Journal) -> None:
        journal.commands.refuse(RowWriting, TemplateFitsTheRow(), expects=[
            Given(writing(template=2), rows=[FOR_PLANS]) >> Refused("template 2 is for plan, not a todo"),
            Given(writing(template=2), rows=[BUG_FIX]) >> Kept(),
            Given(writing(), rows=[FOR_PLANS]) >> Kept(),
            Given(writing(template=9), rows=[FOR_PLANS]) >> Refused("template 9 does not exist: journal template all lists them"),
            Given(RowWriting(type="todo", action="update", actor=AGENT, fields=(("template", 2),)), rows=[FOR_PLANS]) >> Kept(),
        ])
        journal.events.listen(ResourceCreated, SpotRowFromTemplate(), expects=[
            created(Todo(n=5, title="Fix the crash", data={"template": 2, "template_values": {"app": "the viewer"}}))
                >> Dispatches(TemplateChosen(type="todo", n=5, ref=REPRODUCE.ref, sections=(("Steps", "Reproduce it in the viewer"),))),
            created(Todo(n=5, title="Fix the crash", data={"template": 2}))
                >> Dispatches(TemplateChosen(type="todo", n=5, ref=REPRODUCE.ref, sections=(("Steps", "Reproduce it in the app"),))),
            created(Todo(n=5, title="Fix the crash")) >> Dispatches(nothing),
            Given(ResourceCreated(n=5, type="todo", action="created", actor=USER), rows=[BLANK, TEMPLATED])
                >> Dispatches(TemplateChosen(type="todo", n=5, ref=BLANK.ref, sections=())),
        ])
        journal.events.handle(TemplateChosen, StartFromTheTemplate(), expects=[
            Given(TemplateChosen(type="todo", n=5, ref=REPRODUCE.ref, sections=(("Steps", "Reproduce it in the viewer"),)), rows=[REPRODUCE, Todo(n=5, title="Fix the crash")])
                >> Updated(Todo(n=5), sections=[{"title": "Steps", "body": "Reproduce it in the viewer"}]),
        ])
        journal.commands.intercept("show", PrefaceShow(), expects=[
            Given((Todos, CREATING, {"row": TEMPLATED}), rows=[BUG_FIX]) >> Kept(),
            Given((Todos, CREATING, {"row": Todo(n=5, title="Fix the crash")}), rows=[BUG_FIX]) >> Kept(),
        ])
        journal.events.listen(WorkCreated, SpotWorkOnATemplate(), expects=[
            Given(STARTED, rows=[BUG_FIX, TEMPLATED, work_on(), AGENT_ROW]) >> Dispatches(TELL),
            Given(STARTED, rows=[BUG_FIX, Todo(n=5, title="Fix the crash"), work_on(), AGENT_ROW]) >> Dispatches(nothing),
            Given(STARTED, rows=[BUG_FIX, TEMPLATED, work_on(todo=0), AGENT_ROW]) >> Dispatches(nothing),
            Given(STARTED, rows=[BLANK, TEMPLATED, work_on(), AGENT_ROW]) >> Dispatches(nothing),
            Given(STARTED, rows=[BUG_FIX, TEMPLATED, work_on()]) >> Dispatches(nothing),
            Given(STARTED, rows=[BUG_FIX, GONE, work_on(), AGENT_ROW]) >> Dispatches(nothing),
            Given(STARTED, rows=[PADDED, TEMPLATED, work_on(), AGENT_ROW]) >> Dispatches(TemplateToRead(agent=1, n=2, title="Bug fix", brief="Reproduce it first.")),
        ])
        journal.events.listen(SessionStarted, SpotSessionOnATemplate(), expects=[
            Given(SessionStarted(agent=1), rows=[BUG_FIX, TEMPLATED, work_on(), AGENT_ROW]) >> Dispatches(TELL),
            Given(SessionStarted(agent=1), rows=[BUG_FIX, TEMPLATED, AGENT_ROW]) >> Dispatches(nothing),
            Given(SessionStarted(agent=1), rows=[BUG_FIX, Todo(n=5, title="Fix the crash"), work_on(), AGENT_ROW]) >> Dispatches(nothing),
            Given(SessionStarted(agent=1), rows=[BUG_FIX, GONE, work_on(), AGENT_ROW]) >> Dispatches(nothing),
            Given(SessionStarted(agent=1), rows=[BLANK, TEMPLATED, work_on(), AGENT_ROW]) >> Dispatches(nothing),
            Given(SessionStarted(agent=1), rows=[PADDED, TEMPLATED, work_on(), AGENT_ROW]) >> Dispatches(TemplateToRead(agent=1, n=2, title="Bug fix", brief="Reproduce it first.")),
        ])
        journal.events.handle(TemplateToRead, TellTheInstructions(), expects=[
            Given(TELL, rows=[AGENT_ROW]) >> Nudged("instructions", n=2, title="Bug fix", brief="Reproduce it first, then fix it."),
        ])
