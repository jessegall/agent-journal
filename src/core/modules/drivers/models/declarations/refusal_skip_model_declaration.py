from engine.module.model_declaration import ModelDeclaration
from core.modules.drivers.models.refusal_skip import RefusalSkip


class RefusalSkipModelDeclaration(ModelDeclaration):
    """How the module declares RefusalSkip."""

    model = RefusalSkip
    excluded_subcommands = ["make", "edit", "delete"]
