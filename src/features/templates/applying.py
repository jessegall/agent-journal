
from features.parts import ActionInterceptor, Context, Handler
from engine.events.resources import ResourceCreated
from features.templates.instructions import filled
from resources.base import SECTION, Refused
from controllers.types import CONTROLLERS
from features.templates.controller import Templates



class CheckTemplate(ActionInterceptor):
    def intercept(self, feature_context: Context, controller, **args):
        template = feature_context.journal.get(Templates).chosen(args.get("template"))
        if template and template.applies_to and controller.type not in template.applies_to:
            raise Refused(f"template {template.n} is for {', '.join(template.applies_to)}, not a {controller.type}")
        return None


class ApplyTemplate(Handler):
    def handle(self, context: Context, event: ResourceCreated) -> None:
        rows = context.journal.get(CONTROLLERS[event.type])
        row = rows.load(event.n)
        template = context.journal.get(Templates).chosen(row.data.get("template"))
        if not template:
            return
        values = row.data.get("template_values") or {}
        for part in template.sections:
            title, body = filled(template, values, part[SECTION.title]), filled(template, values, part[SECTION.body])
            rows.add_part(row.n, title, body)
        rows.link(row.n, template.ref)
