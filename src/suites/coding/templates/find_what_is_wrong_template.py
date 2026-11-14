from engine.template.template_declaration import TemplateDeclaration
from suites.coding.templates.template_words import CRITIQUE
from suites.coding.templates.template_words import PLAN_TARGETS


class FindWhatIsWrongTemplate(TemplateDeclaration):
    """The Find what is wrong template."""

    title = "Find what is wrong"
    targets = PLAN_TARGETS
    purpose = CRITIQUE
    brief = "Read the plan as someone who has to build it tomorrow and find what will go wrong: a phase that cannot be done in the order given, a task that is too big or too vague to finish, a goal no task reaches, a check that proves nothing. Name each problem with the phase or task it is in and say what to change."
