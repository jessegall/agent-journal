from engine.module.model_declaration import ModelDeclaration
from core.modules.aliases.models.alias import Alias
from core.modules.aliases.queries.alias_query import AliasQuery


class AliasModelDeclaration(ModelDeclaration):
    """How the module declares Alias."""

    model = Alias
    query = AliasQuery
    excluded_subcommands = ["make", "edit", "delete"]
