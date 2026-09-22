import re

from features.parts import ActionInterceptor, Context, Handler
from engine.events import ResourceCreated
from features.templates.instructions import filled
from resources.base import SECTION, Refused

CHECKPOINT = re.compile(r"\s*\(checkpoint\)\s*$", re.IGNORECASE)


def chosen(context: Context, given):
    if not given:
        return None
    try:
        return context.journal.templates.load(int(given))
    except (ValueError, Refused):
        raise Refused(f"template {given} does not exist: journal template all lists them") from None


class CheckTemplate(ActionInterceptor):
    def intercept(self, context: Context, controller, **args):
        template = chosen(context, args.get("template"))
        if template and template.applies_to and controller.type not in template.applies_to:
            raise Refused(f"template {template.n} is for {', '.join(template.applies_to)}, not a {controller.type}")
        return None


class ApplyTemplate(Handler):
    def handle(self, context: Context, event: ResourceCreated) -> None:
        rows = context.journal.of(event.type)
        row = rows.load(event.n)
        template = chosen(context, row.data.get("template"))
        if not template:
            return
        values = row.data.get("template_values") or {}
        for part in template.sections:
            title, body = filled(template, values, part[SECTION.title]), filled(template, values, part[SECTION.body])
            if event.type == "plan":
                rows.phase(row.n, CHECKPOINT.sub("", title), when=body, checkpoint=bool(CHECKPOINT.search(title)))
            else:
                rows.section(row.n, title, body)
        rows.link(row.n, template.ref)
