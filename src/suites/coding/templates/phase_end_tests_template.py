from engine.template.template_declaration import TemplateDeclaration
from suites.coding.templates.template_words import PLAN_TARGETS
from suites.coding.templates.template_words import TESTING


class PhaseEndTestsTemplate(TemplateDeclaration):
    """The Tests at the end of each phase template."""

    title = "Tests at the end of each phase"
    targets = PLAN_TARGETS
    purpose = TESTING
    brief = "Write the tests each task needs, and run the tests only at the end of each phase."
