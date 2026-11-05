from collections.abc import Mapping
from dataclasses import dataclass
from string import Formatter

from core.base.refusal import Refusal
from core.modules.templates.models.template import Template
from core.modules.templates.support.template_row import TemplateRow

RESERVED_BLANKS = frozenset({"target", "type", "id", "title"})


@dataclass(frozen=True)
class TemplatePurpose:
    """The request a template purpose sends and the optional move it gives the target row."""

    prompt: str
    move: str | None = None

    def text(self, template: Template, target: TemplateRow, supplied: Mapping[str, str]) -> str:
        blanks = {name for _, name, _, _ in Formatter().parse(self.prompt) if name is not None}
        values = {**supplied, "target": target.words, "type": target.cli_name, "id": template.id, "title": template.title}
        wrong = sorted((blanks - values.keys()) | (supplied.keys() - blanks) | (supplied.keys() & RESERVED_BLANKS))
        if wrong:
            raise Refusal(f"template {template.id} has missing, unused or reserved values: {', '.join(wrong)}", "journal template show <n> shows its purpose")
        return self.prompt.format_map(values)
