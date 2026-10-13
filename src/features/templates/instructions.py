from framework.parts import ActionInterceptor, Context
from controllers.types import Plans, Templates
from resources.base import Refused

INSTRUCTIONS = "instructions"


def template_of(row, plans, templates):
    """The template a row follows: the one it names, else the one of a plan it is linked to."""
    given = row.data.get("template")
    if not given and row.type == "todo":
        plan = next((p for p in plans.linked_to(row.ref) if p.data.get("template")), None)
        given = plan.data.get("template") if plan else ""
    try:
        return templates.chosen(given)
    except Refused:
        return None


def filled(template, values: dict, text: str) -> str:
    for field in template.declared_fields:
        given = values.get(field.name)
        text = text.replace("{{" + field.name + "}}", str(given) if given else field.default)
    return text


def preface(template, values: dict | None = None) -> str:
    return f"TEMPLATE {template.n}, {template.title}, read before working on this:\n{filled(template, values or {}, template.brief.strip())}\n"


class PrefaceShow(ActionInterceptor):
    def intercept(self, feature_context: Context, controller, row=None, **args):
        journal = feature_context.journal
        template = template_of(row, journal.get(Plans), journal.get(Templates)) if row is not None else None
        if template and template.brief.strip():
            row.preface = preface(template, row.data.get("template_values"))
        return None
