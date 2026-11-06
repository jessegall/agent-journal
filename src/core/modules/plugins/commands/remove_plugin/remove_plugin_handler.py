import shutil

from core.base.actor import Actor
from core.base.plugin_script_processes import PluginScriptProcesses
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from core.modules.plugins.commands.remove_plugin.remove_plugin import RemovePlugin
from core.modules.plugins.queries.plugin_query import PluginQuery
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_readers import PluginReaders
from core.modules.skills.support.plugin_skill_removal import PluginSkillRemoval


class RemovePluginHandler(Handler[RemovePlugin, str]):
    """Deletes a plugin's row, its readers and its code folder, and its data folder only with --purge; only
    the person removes."""

    command = RemovePlugin
    runs_once = True

    def __init__(self, plugins: PluginQuery, folders: PluginFolders, skill_removal: PluginSkillRemoval, repository: Repository, readers: PluginReaders, scripts: PluginScriptProcesses) -> None:
        self.plugins, self.folders, self.skill_removal, self.repository, self.readers, self.scripts = plugins, folders, skill_removal, repository, readers, scripts

    def prepare(self, command: RemovePlugin, actor: Actor) -> None:
        self.scripts.stop(command.name)

    def handle(self, command: RemovePlugin, context: Context) -> str:
        plugin = self.plugins.find_name(command.name)
        self.readers.remove(plugin.name, context)
        self.repository.delete(plugin, context)
        self.skill_removal.remove(plugin.name)
        shutil.rmtree(self.folders.code(plugin.name), ignore_errors=True)
        if command.purge:
            shutil.rmtree(self.folders.data(plugin.name), ignore_errors=True)
            return f"removed {plugin.name} and its data"
        return f"removed {plugin.name}; its data folder stays in .journal/plugin-data/{plugin.name}"
