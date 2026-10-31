from core.modules.templates.models.template import Template


class TemplateHeading:
    """A template's title with what it applies to and its purpose, as show and list print it."""

    @staticmethod
    def text(template: Template) -> str:
        applies = ", ".join(template.targets) or "any"
        purpose = f", {template.purpose}" if template.purpose else ""
        return f"{template.title} (for {applies}{purpose})"
