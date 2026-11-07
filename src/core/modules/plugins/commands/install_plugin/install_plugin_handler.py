import json
import shutil

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.user_approval import UserApproval
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.plugins.commands.install_plugin.install_plugin import InstallPlugin
from core.modules.plugins.commands.support.plugin_install import PluginInstall
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.models.plugin_setting import PluginSetting
from core.modules.plugins.queries.plugin_query import PluginQuery
from core.modules.plugins.support.plugin_digest import PluginDigest
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_install_steps import PluginInstallSteps
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.plugins.support.plugin_readers import PluginReaders
from core.modules.plugins.support.plugin_skill_files import PluginSkillFiles
from core.modules.plugins.support.plugin_staging import EXCLUDED_NAMES, PluginStaging


class InstallPluginHandler(Handler[InstallPlugin, PluginInstall]):
    """Copies a plugin's folder, or a repository at its newest release, into the journal once the programs it
    requires are found and runs its setup
    steps there, before the install's transaction opens so a step may write to the journal itself, a
    failing one leaving nothing behind; then makes its data folder, saves the readers it ships and saves
    it switched on with the settings its installed command answers. A name installed already is refused."""

    command = InstallPlugin
    runs_once = True

    def __init__(self, plugins: PluginQuery, folders: PluginFolders, skill_files: PluginSkillFiles, steps: PluginInstallSteps, repository: Repository,
                 readers: PluginReaders, staging: PluginStaging) -> None:
        self.plugins, self.folders, self.skill_files, self.steps, self.repository, self.readers, self.staging = plugins, folders, skill_files, steps, repository, readers, staging

    def prepare(self, command: InstallPlugin, actor: Actor) -> None:
        if actor.type is ActorType.AGENT:
            raise UserApproval(f"Install the plugin from {command.source}?", ("plugin", "install", command.source, "--yes"))
        self.staging.fetched(command.source)
        manifest = self.uninstalled(command)
        if not command.confirmed:
            return
        folder = self.folders.code(manifest.name)
        source = self.staging.folder(command.source)
        self.steps.check_requirements(manifest, source)
        shutil.copytree(source, folder, dirs_exist_ok=True, ignore=EXCLUDED_NAMES)
        try:
            self.steps.run_setup(manifest, folder)
        except Refusal:
            shutil.rmtree(folder, ignore_errors=True)
            raise

    def handle(self, command: InstallPlugin, context: Context) -> PluginInstall:
        manifest = self.uninstalled(command)
        if not command.confirmed:
            self.staging.cleared(command.source)
            return PluginInstall(manifest, command.source, False)
        self.staging.cleared(command.source)
        folder = self.folders.code(manifest.name)
        self.folders.data(manifest.name).mkdir(parents=True, exist_ok=True)
        self.skill_files.publish(folder, manifest)
        self.readers.publish(folder, manifest.name, context)
        plugin = self.repository.save(Plugin(creator_id=context.actor.id, name=manifest.name, title=manifest.title, source=command.source,
                                             release=manifest.version, files_digest=PluginDigest.digest(folder, manifest)), context)
        declared = {setting.key for setting in manifest.settings}
        for key, value in self.steps.installed_settings(manifest, folder).items():
            if key in declared:
                self.repository.save(PluginSetting(plugin_id=plugin.id, creator_id=context.actor.id, key=key, value=json.dumps(value)), context)
        return PluginInstall(manifest, command.source, True)

    def uninstalled(self, command: InstallPlugin) -> PluginManifest:
        manifest = PluginManifest.read(self.staging.folder(command.source))
        if self.plugins.is_installed(manifest.name):
            raise Refusal(f"a plugin named {manifest.name} is installed already", f"journal plugin upgrade {manifest.name}")
        return manifest
