from engine.module.suite import Suite
from engine.module.module import Module
from engine.template.template_declaration import TemplateDeclaration


class AcmeReviewModule(Module):
    name = "acme.review"
    requires_engine = ">=7,<8"
    dependencies = ["journal.core.templates", "journal.core.plans", "journal.suites.coding"]
    templates = [TemplateDeclaration(title="Security review", targets=("plan",), purpose="critique",
                                     brief="Read the plan as an attacker. Name each way in and what closes it.")]


class AcmeReviewModuleJoining(Suite):
    name = "acme.review"
    joins = "coding"
    modules = [AcmeReviewModule]
