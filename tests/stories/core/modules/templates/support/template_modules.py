from engine.module.module import Module
from engine.template.template_declaration import TemplateDeclaration

PATH = "tests.stories.core.modules.templates.support.template_modules"
REVIEW = TemplateDeclaration(title="Security review", brief="Review the plan for security problems.",
                             targets=("plan",), purpose="critique", parts=("Problems",), commands=("journal plan list",))


class ReviewModule(Module):
    name = "acme.review"
    requires_engine = ">=7,<8"
    dependencies = ["journal.core.plans", "journal.core.templates"]
    templates = [REVIEW]


class DuplicateTitleModule(Module):
    name = "acme.other"
    requires_engine = ">=7,<8"
    dependencies = ["acme.review"]
    templates = [REVIEW]
