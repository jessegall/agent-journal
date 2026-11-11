from engine.module.suite import Suite
from engine.module.module import Module
from engine.viewer.button_declaration import ButtonCondition, ButtonDeclaration


class DemoReviewModule(Module):
    name = "acme.demo"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.plans", "journal.core.viewer", "journal.suites.coding"]
    buttons = [ButtonDeclaration("demo.review", ("dock.plans.waiting", "row.plan"), "Review the plan",
                                 "plan edit {row_id} --brief=Reviewed", icon="review",
                                 condition=ButtonCondition("state", tuple(["ready"])))]


class DemoReviewModuleJoining(Suite):
    name = "acme.demo"
    joins = "coding"
    modules = [DemoReviewModule]
