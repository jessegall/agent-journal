from events.asking import RowWriting
from receiving import Refuser
from resources.base import Refused
from resources.templates import Template
from serving import ReadRows


class TemplateFitsTheRow(Refuser[RowWriting]):
    def refuse(self, event: RowWriting, templates: ReadRows[Template]) -> None:
        template = templates.chosen(dict(event.fields).get("template")) if event.action == "create" else None
        if template and template.applies_to and event.type not in template.applies_to:
            raise Refused(f"template {template.n} is for {', '.join(template.applies_to)}, not a {event.type}")
