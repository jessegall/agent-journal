from engine.module.model_declaration import ModelDeclaration
from core.modules.accounts.models.login_attempt import LoginAttempt
from core.modules.accounts.support.hidden_subcommands import HIDDEN_SUBCOMMANDS


class LoginAttemptModelDeclaration(ModelDeclaration):
    """How the module declares LoginAttempt."""

    model = LoginAttempt
    excluded_subcommands = HIDDEN_SUBCOMMANDS
