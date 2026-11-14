from engine.module.model_declaration import ModelDeclaration
from core.modules.plans.models.plan_context_read import PlanContextRead
from engine.module.model_declaration import ALL_SUBCOMMANDS


class PlanContextReadModelDeclaration(ModelDeclaration):
    """How the module declares PlanContextRead."""

    model = PlanContextRead
    excluded_subcommands = ALL_SUBCOMMANDS
