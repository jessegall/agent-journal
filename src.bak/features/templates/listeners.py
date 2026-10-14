from events import Fact
from events.agents import SessionStarted
from events.resources import ResourceCreated
from events.templates import TemplateChosen, TemplateToRead
from events.works import WorkCreated
from features.templates.instructions import filled, template_of
from receiving import Listener
from resources.base import SECTION
from resources.templates import Template
from resources.types import AgentRow, Plan, Todo, Work
from serving import ReadElsewhere, ReadRows


def instructions(agent: int, work: Work, todos: ReadRows[Todo], plans: ReadRows[Plan], templates: ReadRows[Template]) -> list[Fact]:
    """The instructions of the template the work's row follows, for the agent that is on it."""
    template = template_of(todos.load(work.todo), plans, templates) if work.todo else None
    if not template or not template.brief.strip():
        return []
    return [TemplateToRead(agent=agent, n=template.n, title=template.title, brief=template.brief.strip())]


class SpotRowFromTemplate(Listener[ResourceCreated]):
    def listen(self, event: ResourceCreated, elsewhere: ReadElsewhere, templates: ReadRows[Template]) -> list[Fact]:
        row = elsewhere.here().rows_named(event.type).load(event.n)
        template = templates.chosen(row.data.get("template"))
        if not template:
            return []
        values = row.data.get("template_values") or {}
        sections = tuple((filled(template, values, part[SECTION.title]), filled(template, values, part[SECTION.body])) for part in template.sections)
        return [TemplateChosen(type=event.type, n=event.n, ref=template.ref, sections=sections)]


class SpotWorkOnATemplate(Listener[WorkCreated]):
    def listen(self, event: WorkCreated, agents: ReadRows[AgentRow], works: ReadRows[Work], todos: ReadRows[Todo], plans: ReadRows[Plan], templates: ReadRows[Template]) -> list[Fact]:
        main = agents.primary_to_read()
        return instructions(main.n, works.load(event.n), todos, plans, templates) if main else []


class SpotSessionOnATemplate(Listener[SessionStarted]):
    def listen(self, event: SessionStarted, works: ReadRows[Work], todos: ReadRows[Todo], plans: ReadRows[Plan], templates: ReadRows[Template]) -> list[Fact]:
        work = works.active()
        return instructions(event.agent, work, todos, plans, templates) if work else []
