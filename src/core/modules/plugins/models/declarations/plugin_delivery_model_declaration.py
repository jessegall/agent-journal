from engine.module.model_declaration import ModelDeclaration
from core.modules.plugins.models.plugin_delivery import PluginDelivery
from engine.module.model_declaration import ALL_SUBCOMMANDS


class PluginDeliveryModelDeclaration(ModelDeclaration):
    """How the module declares PluginDelivery."""

    model = PluginDelivery
    excluded_subcommands = ALL_SUBCOMMANDS
