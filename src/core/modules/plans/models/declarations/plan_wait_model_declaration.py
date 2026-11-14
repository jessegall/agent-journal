from engine.module.model_declaration import ModelDeclaration
from core.modules.plans.models.plan_wait import PlanWait
from engine.module.model_declaration import ALL_SUBCOMMANDS


class PlanWaitModelDeclaration(ModelDeclaration):
    """How the module declares PlanWait."""

    model = PlanWait
    excluded_subcommands = ALL_SUBCOMMANDS
