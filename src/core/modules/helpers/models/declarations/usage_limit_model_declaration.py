from engine.module.model_declaration import ModelDeclaration
from core.modules.helpers.models.usage_limit import UsageLimit


class UsageLimitModelDeclaration(ModelDeclaration):
    """How the module declares UsageLimit."""

    model = UsageLimit
    excluded_subcommands = ["make"]
