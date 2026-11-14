from engine.module.model_declaration import ModelDeclaration
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.queries.plugin_query import PluginQuery
from engine.module.model_declaration import ALL_SUBCOMMANDS


class PluginModelDeclaration(ModelDeclaration):
    """How the module declares Plugin."""

    model = Plugin
    query = PluginQuery
    excluded_subcommands = ALL_SUBCOMMANDS
