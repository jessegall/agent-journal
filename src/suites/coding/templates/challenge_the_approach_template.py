from engine.template.template_declaration import TemplateDeclaration
from suites.coding.templates.template_words import CRITIQUE
from suites.coding.templates.template_words import PLAN_TARGETS


class ChallengeTheApproachTemplate(TemplateDeclaration):
    """The Challenge the approach template."""

    title = "Challenge the approach"
    targets = PLAN_TARGETS
    purpose = CRITIQUE
    brief = "Question the plan's approach as a whole: is there a simpler way to reach the same goal, something that already exists and could be reused, a risk the plan takes without saying so. Give the alternative and what it would cost."
