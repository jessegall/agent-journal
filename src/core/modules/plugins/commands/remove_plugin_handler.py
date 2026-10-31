import shutil

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from core.modules.plugins.commands.remove_plugin import RemovePlugin
from core.modules.plugins.commands.support.user_actor_check import UserActorCheck
from core.modules.plugins.queries.plugin_query import PluginQuery
from core.modules.plugins.support.plugin_folders import PluginFolders


class RemovePluginHandler(Handler[RemovePlugin, str]):
    """Deletes a plugin's row and its code folder, and its data folder only with --purge; only the person removes."""

    command = RemovePlugin

    def __init__(self, plugins: PluginQuery, folders: PluginFolders, repository: Repository) -> None:
        self.plugins, self.folders, self.repository = plugins, folders, repository

    def handle(self, command: RemovePlugin, context: Context) -> str:
        UserActorCheck.check(context, "removes")
        plugin = self.plugins.find_name(command.name)
        self.repository.delete(plugin, context)
        shutil.rmtree(self.folders.code(plugin.name), ignore_errors=True)
        if command.purge:
            shutil.rmtree(self.folders.data(plugin.name), ignore_errors=True)
            return f"removed {plugin.name} and its data"
        return f"removed {plugin.name}; its data folder stays in .journal/plugin-data/{plugin.name}"
