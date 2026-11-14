from engine.module.model_declaration import ModelDeclaration
from core.modules.accounts.models.person_session import PersonSession
from core.modules.accounts.support.hidden_subcommands import HIDDEN_SUBCOMMANDS


class PersonSessionModelDeclaration(ModelDeclaration):
    """How the module declares PersonSession."""

    model = PersonSession
    excluded_subcommands = HIDDEN_SUBCOMMANDS
