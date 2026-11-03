import shutil

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from core.modules.plugins.commands.remove_plugin.remove_plugin import RemovePlugin
from core.modules.plugins.queries.plugin_query import PluginQuery
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_readers import PluginReaders
from core.modules.plugins.support.plugin_skill_files import PluginSkillFiles


class RemovePluginHandler(Handler[RemovePlugin, str]):
    """Deletes a plugin's row, its readers and its code folder, and its data folder only with --purge; only
    the person removes."""

    command = RemovePlugin

    def __init__(self, plugins: PluginQuery, folders: PluginFolders, skill_files: PluginSkillFiles, repository: Repository, readers: PluginReaders) -> None:
        self.plugins, self.folders, self.skill_files, self.repository, self.readers = plugins, folders, skill_files, repository, readers

    def handle(self, command: RemovePlugin, context: Context) -> str:
        plugin = self.plugins.find_name(command.name)
        self.readers.withdraw(plugin.name, context)
        self.repository.delete(plugin, context)
        self.skill_files.withdraw(plugin.name)
        shutil.rmtree(self.folders.code(plugin.name), ignore_errors=True)
        if command.purge:
            shutil.rmtree(self.folders.data(plugin.name), ignore_errors=True)
            return f"removed {plugin.name} and its data"
        return f"removed {plugin.name}; its data folder stays in .journal/plugin-data/{plugin.name}"
