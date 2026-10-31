from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from core.modules.plugins.commands.support.user_actor_check import UserActorCheck
from core.modules.plugins.commands.switch_plugin import SwitchPlugin
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.queries.plugin_query import PluginQuery
from core.modules.plugins.support.plugin_digest import PluginDigest
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.plugins.support.plugin_skill_files import PluginSkillFiles


class SwitchPluginHandler(Handler[SwitchPlugin, Plugin]):
    """Switches an installed plugin on or off; only the person does, and switching it on takes its files as
    they are now."""

    command = SwitchPlugin

    def __init__(self, plugins: PluginQuery, folders: PluginFolders, skill_files: PluginSkillFiles, repository: Repository) -> None:
        self.plugins, self.folders, self.skill_files, self.repository = plugins, folders, skill_files, repository

    def handle(self, command: SwitchPlugin, context: Context) -> Plugin:
        UserActorCheck.check(context, "switches on" if command.enabled else "switches off")
        plugin = self.plugins.find_name(command.name)
        folder = self.folders.code(plugin.name)
        if not command.enabled:
            self.skill_files.withdraw(plugin.name)
            return self.repository.save(plugin.changed(enabled=False), context)
        manifest = PluginManifest.read(folder)
        self.skill_files.publish(folder, manifest)
        digest = PluginDigest.digest(folder, manifest)
        return self.repository.save(plugin.changed(enabled=command.enabled, files_digest=digest), context)
