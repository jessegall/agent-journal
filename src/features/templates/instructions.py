from engine.events import ResourceCreated, SessionStarted
from features.parts import ActionInterceptor, AgentContext, Context, Handler
from resources.base import Refused

INSTRUCTIONS = "instructions"


def template_of(journal, row):
    given = row.data.get("template")
    if not given and row.type == "todo":
        plan = next((p for p in journal.plans._every() if row.ref in p.refs and p.data.get("template")), None)
        given = plan.data.get("template") if plan else ""
    try:
        return journal.templates.load(int(given)) if given else None
    except (ValueError, Refused):
        return None


def filled(template, values: dict, text: str) -> str:
    for field in template.declared_fields:
        given = values.get(field.name)
        text = text.replace("{{" + field.name + "}}", str(given) if given else field.default)
    return text


def preface(template, values: dict | None = None) -> str:
    return f"TEMPLATE {template.n}, {template.title}, read before working on this:\n{filled(template, values or {}, template.brief.strip())}\n"


class PrefaceShow(ActionInterceptor):
    def intercept(self, context: Context, controller, row=None, **args):
        template = template_of(context.journal, row) if row is not None else None
        if template and template.brief.strip():
            row.preface = preface(template, row.data.get("template_values"))
        return None


class TellOnStart(Handler):
    def handle(self, context: Context, event: ResourceCreated) -> None:
        main = context.journal.agents.primary() if event.type == "work" else None
        if main:
            tell(context.speaking_to(main), context.journal.works.load(event.n))


class TellAgainOnSessionStart(Handler):
    def handle(self, context: AgentContext, event: SessionStarted) -> None:
        work = context.journal.works.active()
        if work and context.agent:
            tell(context, work)


def tell(context: Context, work) -> None:
    if not work.todo:
        return
    template = template_of(context.journal, context.journal.todos.load(int(work.todo)))
    if template and template.brief.strip():
        context.agent.whisper(INSTRUCTIONS, n=template.n, title=template.title, brief=template.brief.strip())
