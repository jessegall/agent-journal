from engine.module.model_declaration import ModelDeclaration
from core.modules.plugins.models.plugin_queue_file import PluginQueueFile
from engine.module.model_declaration import ALL_SUBCOMMANDS


class PluginQueueFileModelDeclaration(ModelDeclaration):
    """How the module declares PluginQueueFile."""

    model = PluginQueueFile
    excluded_subcommands = ALL_SUBCOMMANDS
