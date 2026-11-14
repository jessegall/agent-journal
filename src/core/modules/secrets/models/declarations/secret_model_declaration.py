from engine.module.model_declaration import ModelDeclaration
from core.modules.secrets.models.secret import Secret
from core.modules.secrets.queries.secret_query import SecretQuery
from engine.module.model_declaration import ALL_SUBCOMMANDS


class SecretModelDeclaration(ModelDeclaration):
    """How the module declares Secret."""

    model = Secret
    query = SecretQuery
    excluded_subcommands = ALL_SUBCOMMANDS
