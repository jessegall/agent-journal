from core.modules.templates.models.template import Template


class TemplateHeading:
    """A template's title, target, purpose and origin for list and show output."""

    @staticmethod
    def text(template: Template) -> str:
        applies = ", ".join(template.targets) or "any"
        purpose = f", {template.purpose}" if template.purpose else ""
        origin = f"Module: {template.module}" if template.module else "Written by a person"
        return f"{template.title} (for {applies}{purpose}) · {origin}"
