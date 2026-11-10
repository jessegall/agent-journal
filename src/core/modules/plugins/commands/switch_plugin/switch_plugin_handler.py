from engine.actor.actor import Actor
from core.base.plugin_script_processes import PluginScriptProcesses
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from core.modules.plugins.commands.switch_plugin.switch_plugin import SwitchPlugin
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.queries.plugin_query import PluginQuery
from core.modules.plugins.support.plugin_digest import PluginDigest
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_places import PluginPlaces
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.plugins.support.plugin_skill_files import PluginSkillFiles
from core.modules.skills.support.plugin_skill_removal import PluginSkillRemoval


class SwitchPluginHandler(Handler[SwitchPlugin, Plugin]):
    """Switches an installed plugin on or off, and switching it on takes its files as
    they are now."""

    command = SwitchPlugin
    runs_once = True

    def __init__(self, plugins: PluginQuery, folders: PluginFolders, skill_files: PluginSkillFiles, skill_removal: PluginSkillRemoval, repository: Repository, scripts: PluginScriptProcesses, places: PluginPlaces) -> None:
        self.plugins, self.folders, self.skill_files, self.skill_removal, self.repository, self.scripts, self.places = plugins, folders, skill_files, skill_removal, repository, scripts, places

    def prepare(self, command: SwitchPlugin, actor: Actor) -> None:
        if not command.enabled:
            self.scripts.stop(command.name)
            self.places.stop(command.name)

    def handle(self, command: SwitchPlugin, context: Context) -> Plugin:
        plugin = self.plugins.find_name(command.name)
        folder = self.folders.code(plugin.name)
        if not command.enabled:
            self.skill_removal.remove(plugin.name)
            return self.repository.save(plugin.changed(enabled=False), context)
        manifest = PluginManifest.read(folder)
        self.skill_files.publish(folder, manifest)
        digest = PluginDigest.digest(folder, manifest)
        return self.repository.save(plugin.changed(enabled=command.enabled, files_digest=digest), context)
