from engine.module.model_declaration import ModelDeclaration
from core.modules.accounts.models.person_login import PersonLogin
from core.modules.accounts.support.hidden_subcommands import HIDDEN_SUBCOMMANDS


class PersonLoginModelDeclaration(ModelDeclaration):
    """How the module declares PersonLogin."""

    model = PersonLogin
    excluded_subcommands = HIDDEN_SUBCOMMANDS
