from engine.template.template_declaration import TemplateDeclaration
from suites.coding.templates.template_words import CRITIQUE
from suites.coding.templates.template_words import PLAN_TARGETS


class FindWhatIsMissingTemplate(TemplateDeclaration):
    """The Find what is missing template."""

    title = "Find what is missing"
    targets = PLAN_TARGETS
    purpose = CRITIQUE
    brief = "Read the plan against its goal and add what it leaves out: the step nobody wrote down, the migration, the test, the error case, the user who is not the author. Propose each addition as a task with the phase it belongs in."
