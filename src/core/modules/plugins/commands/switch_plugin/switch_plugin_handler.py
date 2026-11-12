from engine.actor.actor import Actor
from engine.process.plugin_script_processes import PluginScriptProcesses
from engine.command.context import Context
from engine.command.handler import Handler
from engine.repository.repository import Repository
from core.modules.plugins.commands.switch_plugin.switch_plugin import SwitchPlugin
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.queries.plugin_query import PluginQuery
from core.modules.plugins.support.plugin_digest import PluginDigest
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_places import PluginPlaces
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.plugins.support.plugin_skill_files import PluginSkillFiles


class SwitchPluginHandler(Handler[SwitchPlugin, Plugin]):
    """Switches an installed plugin on or off, and switching it on takes its files as
    they are now."""

    command = SwitchPlugin
    runs_once = True

    def __init__(self, plugins: PluginQuery, folders: PluginFolders, skill_files: PluginSkillFiles, repository: Repository, scripts: PluginScriptProcesses, places: PluginPlaces) -> None:
        self.plugins, self.folders, self.skill_files, self.repository, self.scripts, self.places = plugins, folders, skill_files, repository, scripts, places

    def prepare(self, command: SwitchPlugin, actor: Actor) -> None:
        if not command.enabled:
            self.scripts.stop(command.name)
            self.places.stop(command.name)

    def handle(self, command: SwitchPlugin, context: Context) -> Plugin:
        plugin = self.plugins.find_name(command.name)
        folder = self.folders.code(plugin.name)
        if not command.enabled:
            return self.repository.save(plugin.changed(enabled=False), context)
        manifest = PluginManifest.read(folder)
        self.skill_files.publish(folder, manifest)
        digest = PluginDigest.digest(folder, manifest)
        return self.repository.save(plugin.changed(enabled=command.enabled, files_digest=digest), context)
