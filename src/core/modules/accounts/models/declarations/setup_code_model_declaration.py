from engine.module.model_declaration import ModelDeclaration
from core.modules.accounts.models.setup_code import SetupCode
from core.modules.accounts.support.hidden_subcommands import HIDDEN_SUBCOMMANDS


class SetupCodeModelDeclaration(ModelDeclaration):
    """How the module declares SetupCode."""

    model = SetupCode
    excluded_subcommands = HIDDEN_SUBCOMMANDS
