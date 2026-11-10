from engine.module.module import Module
from engine.template.template_declaration import TemplateDeclaration
from engine.viewer.button_declaration import ButtonCondition, ButtonDeclaration

from .audit_plan_handler import AuditPlanHandler
from .audit_plan_subcommand import AuditPlanSubcommand


class AcmeReviewModule(Module):
    name = "acme.review"
    requires_core = ">=5,<6"
    parent_suite = "coding"
    dependencies = ["journal.core.plans", "journal.core.templates", "journal.core.viewer", "journal.suites.coding"]
    handlers = [AuditPlanHandler]
    subcommands = [AuditPlanSubcommand]
    templates = [TemplateDeclaration(title="Security review", targets=tuple(["plan"]), purpose="critique",
                                     brief="Read the plan as an attacker. Name each way in and what closes it.")]
    buttons = [ButtonDeclaration("review.audit", ("dock.plans.waiting", "row.plan"), "Audit", "acme audit {row_id}", icon="review",
                                 condition=ButtonCondition("state", tuple(["ready"])))]
