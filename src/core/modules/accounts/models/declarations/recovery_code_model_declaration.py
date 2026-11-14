from engine.module.model_declaration import ModelDeclaration
from core.modules.accounts.models.recovery_code import RecoveryCode
from core.modules.accounts.support.hidden_subcommands import HIDDEN_SUBCOMMANDS


class RecoveryCodeModelDeclaration(ModelDeclaration):
    """How the module declares RecoveryCode."""

    model = RecoveryCode
    excluded_subcommands = HIDDEN_SUBCOMMANDS
