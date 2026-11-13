from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.plugins.commands.update_plugin_readers.update_plugin_readers import UpdatePluginReaders
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_readers import PluginReaders
from core.modules.plugins.support.runnable_plugins import RunnablePlugins


class UpdatePluginReadersHandler(Handler[UpdatePluginReaders, None]):
    """Puts back each reader a running plugin ships and the project lost, as the journal starts."""

    command = UpdatePluginReaders

    def __init__(self, runnable: RunnablePlugins, folders: PluginFolders, readers: PluginReaders) -> None:
        self.runnable, self.folders, self.readers = runnable, folders, readers

    def handle(self, command: UpdatePluginReaders, context: Context) -> None:
        for runnable in self.runnable.running():
            self.readers.publish(self.folders.code(runnable.plugin.name), runnable.plugin.name, context)
