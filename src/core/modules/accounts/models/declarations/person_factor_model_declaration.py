from engine.module.model_declaration import ModelDeclaration
from core.modules.accounts.models.person_factor import PersonFactor
from core.modules.accounts.support.hidden_subcommands import HIDDEN_SUBCOMMANDS


class PersonFactorModelDeclaration(ModelDeclaration):
    """How the module declares PersonFactor."""

    model = PersonFactor
    excluded_subcommands = HIDDEN_SUBCOMMANDS
