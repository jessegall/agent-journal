from engine.module.model_declaration import ModelDeclaration
from core.modules.plugins.models.plugin_output import PluginOutput
from engine.module.model_declaration import ALL_SUBCOMMANDS


class PluginOutputModelDeclaration(ModelDeclaration):
    """How the module declares PluginOutput."""

    model = PluginOutput
    excluded_subcommands = ALL_SUBCOMMANDS
