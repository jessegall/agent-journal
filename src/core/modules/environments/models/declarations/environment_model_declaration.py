from engine.module.model_declaration import ModelDeclaration
from core.modules.environments.models.environment import Environment
from core.modules.environments.queries.environment_query import EnvironmentQuery


class EnvironmentModelDeclaration(ModelDeclaration):
    """How the module declares Environment."""

    model = Environment
    query = EnvironmentQuery
    excluded_subcommands = ["list"]
