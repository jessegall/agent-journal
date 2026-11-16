from engine.template.template_declaration import TemplateDeclaration


class GeneralCritiqueTemplate(TemplateDeclaration):
    """The General critique template."""

    title = "General critique"
    targets = ("plan",)
    purpose = "critique"
    brief = "Read it as a whole and say what you would change, and why."
