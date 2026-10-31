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
from core.modules.plugins.queries.plugin_query import PluginQuery
from core.modules.plugins.support.plugin_digest import PluginDigest
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.plugins.support.plugin_skill_files import PluginSkillFiles


class InstallPluginHandler(Handler[InstallPlugin, PluginInstall]):
    """Copies a plugin's folder into the journal, makes its data folder and saves it switched on; only the person
    installs, and a name installed already is refused."""

    command = InstallPlugin

    def __init__(self, plugins: PluginQuery, folders: PluginFolders, skill_files: PluginSkillFiles, repository: Repository) -> None:
        self.plugins, self.folders, self.skill_files, self.repository = plugins, folders, skill_files, repository

    def handle(self, command: InstallPlugin, context: Context) -> PluginInstall:
        UserActorCheck.check(context, "installs")
        manifest = PluginManifest.read(Path(command.source))
        if self.plugins.is_installed(manifest.name):
            raise Refusal(f"a plugin named {manifest.name} is installed already", f"journal plugin upgrade {manifest.name}")
        if not command.confirmed:
            return PluginInstall(manifest, command.source, False)
        shutil.copytree(command.source, self.folders.code(manifest.name), dirs_exist_ok=True)
        self.folders.data(manifest.name).mkdir(parents=True, exist_ok=True)
        self.skill_files.publish(self.folders.code(manifest.name), manifest)
        self.repository.save(Plugin(creator_id=context.actor.id, name=manifest.name, title=manifest.title, source=command.source, release=manifest.version,
                                    files_digest=PluginDigest.digest(self.folders.code(manifest.name))), context)
        return PluginInstall(manifest, command.source, True)
