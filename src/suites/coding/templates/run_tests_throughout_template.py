from engine.template.template_declaration import TemplateDeclaration
from suites.coding.templates.template_words import PLAN_TARGETS
from suites.coding.templates.template_words import TESTING


class RunTestsThroughoutTemplate(TemplateDeclaration):
    """The Test throughout template."""

    title = "Test throughout"
    targets = PLAN_TARGETS
    purpose = TESTING
    brief = "Run the full suite whenever it helps, and after every task at least."
