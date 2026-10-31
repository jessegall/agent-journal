import json
import shutil
from pathlib import Path

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.plugins.commands.install_plugin import InstallPlugin
from core.modules.plugins.commands.support.plugin_install import PluginInstall
from core.modules.plugins.commands.support.user_actor_check import UserActorCheck
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.models.plugin_setting import PluginSetting
from core.modules.plugins.queries.plugin_query import PluginQuery
from core.modules.plugins.support.plugin_digest import PluginDigest
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_install_steps import PluginInstallSteps
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.plugins.support.plugin_skill_files import PluginSkillFiles


class InstallPluginHandler(Handler[InstallPlugin, PluginInstall]):
    """Copies a plugin's folder into the journal once the programs it requires are found, runs its setup
    steps there, a failing one leaving nothing behind, makes its data folder and saves it switched on with the
    settings its installed command answers; only the person installs, and a name installed already is refused."""

    command = InstallPlugin

    def __init__(self, plugins: PluginQuery, folders: PluginFolders, skill_files: PluginSkillFiles, steps: PluginInstallSteps, repository: Repository) -> None:
        self.plugins, self.folders, self.skill_files, self.steps, self.repository = plugins, folders, skill_files, steps, repository

    def handle(self, command: InstallPlugin, context: Context) -> PluginInstall:
        UserActorCheck.check(context, "installs")
        manifest = PluginManifest.read(Path(command.source))
        if self.plugins.is_installed(manifest.name):
            raise Refusal(f"a plugin named {manifest.name} is installed already", f"journal plugin upgrade {manifest.name}")
        if not command.confirmed:
            return PluginInstall(manifest, command.source, False)
        folder = self.folders.code(manifest.name)
        self.steps.check_requirements(manifest, Path(command.source))
        shutil.copytree(command.source, folder, dirs_exist_ok=True)
        try:
            self.steps.run_setup(manifest, folder)
        except Refusal:
            shutil.rmtree(folder, ignore_errors=True)
            raise
        self.folders.data(manifest.name).mkdir(parents=True, exist_ok=True)
        self.skill_files.publish(folder, manifest)
        plugin = self.repository.save(Plugin(creator_id=context.actor.id, name=manifest.name, title=manifest.title, source=command.source,
                                             release=manifest.version, files_digest=PluginDigest.digest(folder, manifest)), context)
        declared = {setting.key for setting in manifest.settings}
        for key, value in self.steps.installed_settings(manifest, folder).items():
            if key in declared:
                self.repository.save(PluginSetting(plugin_id=plugin.id, creator_id=context.actor.id, key=key, value=json.dumps(value)), context)
        return PluginInstall(manifest, command.source, True)
