from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.plugins.commands.publish_plugin_readers.publish_plugin_readers import PublishPluginReaders
from core.modules.plugins.queries.plugin_query import PluginQuery
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_readers import PluginReaders


class PublishPluginReadersHandler(Handler[PublishPluginReaders, None]):
    """Publishes the readers a plugin that is switched on ships. The readers of a plugin switched off stay, for its
    aliases still hold them; removing the plugin takes them."""

    command = PublishPluginReaders

    def __init__(self, plugins: PluginQuery, folders: PluginFolders, readers: PluginReaders) -> None:
        self.plugins, self.folders, self.readers = plugins, folders, readers

    def handle(self, command: PublishPluginReaders, context: Context) -> None:
        plugin = self.plugins.find_name(command.name)
        if plugin.enabled:
            self.readers.publish(self.folders.code(plugin.name), plugin.name, context)
