from core.base.module.module import Module
from core.base.template.template_declaration import TemplateDeclaration

PATH = "tests.stories.core.modules.templates.support.template_modules"
REVIEW = TemplateDeclaration(title="Security review", brief="Review the plan for security problems.",
                             targets=tuple(["plan"]), purpose="critique", parts=tuple(["Problems"]), commands=tuple(["journal plan list"]))


class ReviewModule(Module):
    name = "acme.review"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.plans", "journal.core.templates"]
    templates = [REVIEW]


class DuplicateTitleModule(Module):
    name = "acme.other"
    requires_core = ">=5,<6"
    dependencies = ["acme.review"]
    templates = [REVIEW]
