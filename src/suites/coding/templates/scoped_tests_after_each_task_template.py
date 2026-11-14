from engine.template.template_declaration import TemplateDeclaration
from suites.coding.templates.template_words import PLAN_TARGETS
from suites.coding.templates.template_words import TESTING


class ScopedTestsAfterEachTaskTemplate(TemplateDeclaration):
    """The Scoped tests after each task template."""

    title = "Scoped tests after each task"
    targets = PLAN_TARGETS
    purpose = TESTING
    brief = "After each task run the tests that cover what it changed, by name, and the full suite at the end of each phase."
