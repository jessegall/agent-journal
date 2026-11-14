from engine.template.template_declaration import TemplateDeclaration
from suites.coding.templates.template_words import PLAN_TARGETS
from suites.coding.templates.template_words import TESTING


class NeverRunTestsTemplate(TemplateDeclaration):
    """The Never run tests template."""

    title = "Never run tests"
    targets = PLAN_TARGETS
    purpose = TESTING
    brief = "Run no tests while you follow this plan; write the tests that prove each task and leave them for the user to run."
