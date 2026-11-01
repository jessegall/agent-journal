import shutil

from core.base.actor import Actor
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.plugins.commands.support.user_actor_check import UserActorCheck
from core.modules.plugins.commands.upgrade_plugin.upgrade_plugin import UpgradePlugin
from core.modules.plugins.queries.plugin_query import PluginQuery
from core.modules.plugins.support.plugin_digest import PluginDigest
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_install_steps import PluginInstallSteps
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.plugins.support.plugin_readers import PluginReaders
from core.modules.plugins.support.plugin_skill_files import PluginSkillFiles
from core.modules.plugins.support.plugin_staging import EXCLUDED_NAMES, PluginStaging
from core.modules.plugins.support.plugin_upgrade import PluginUpgrade

NEW_SUFFIX = ".new"
OLD_SUFFIX = ".old"


class UpgradePluginHandler(Handler[UpgradePlugin, PluginUpgrade]):
    """Fetches a plugin's source and, once confirmed, sets the new code up beside the old and swaps them
    before the transaction opens, so a failing step leaves the old one in place; running services keep the old
    code until the journal restarts."""

    command = UpgradePlugin

    def __init__(self, plugins: PluginQuery, folders: PluginFolders, staging: PluginStaging, steps: PluginInstallSteps, repository: Repository, skill_files: PluginSkillFiles, readers: PluginReaders) -> None:
        self.plugins, self.folders, self.staging, self.steps, self.repository, self.skill_files, self.readers = plugins, folders, staging, steps, repository, skill_files, readers

    def prepare(self, command: UpgradePlugin, actor: Actor) -> None:
        UserActorCheck.check_actor(actor, "upgrades")
        plugin = self.plugins.find_name(command.name)
        source = self.staging.fetched(plugin.source)
        manifest = PluginManifest.read(source)
        if manifest.name != plugin.name:
            self.staging.cleared(plugin.source)
            raise Refusal(f"the source of {plugin.name} now contains a plugin called {manifest.name}", "install that one under its own name")
        if not command.confirmed:
            return
        self.steps.check_requirements(manifest, source)
        code = self.folders.code(plugin.name)
        new_code, old_code = code.with_name(code.name + NEW_SUFFIX), code.with_name(code.name + OLD_SUFFIX)
        shutil.rmtree(new_code, ignore_errors=True)
        shutil.copytree(source, new_code, ignore=EXCLUDED_NAMES)
        try:
            self.steps.run_setup(manifest, new_code)
        except Refusal:
            shutil.rmtree(new_code, ignore_errors=True)
            raise
        shutil.rmtree(old_code, ignore_errors=True)
        code.rename(old_code)
        new_code.rename(code)
        shutil.rmtree(old_code, ignore_errors=True)

    def handle(self, command: UpgradePlugin, context: Context) -> PluginUpgrade:
        UserActorCheck.check(context, "upgrades")
        plugin = self.plugins.find_name(command.name)
        code = self.folders.code(plugin.name)
        if not command.confirmed:
            old, offered = PluginManifest.read(code), PluginManifest.read(self.staging.folder(plugin.source))
            self.staging.cleared(plugin.source)
            return PluginUpgrade(plugin.name, plugin.release, offered.version, self.changes(old, offered), False)
        self.staging.cleared(plugin.source)
        manifest = PluginManifest.read(code)
        self.skill_files.publish(code, manifest)
        self.readers.publish(code, manifest.name, context)
        self.repository.save(plugin.changed(release=manifest.version, files_digest=PluginDigest.digest(code, manifest)), context)
        return PluginUpgrade(plugin.name, plugin.release, manifest.version, [], True)

    @staticmethod
    def changes(old: PluginManifest, offered: PluginManifest) -> list[str]:
        previous, after = UpgradePluginHandler.run_lines(old), UpgradePluginHandler.run_lines(offered)
        return [*(f"no longer {line}" for line in previous if line not in after), *(f"new {line}" for line in after if line not in previous)]

    @staticmethod
    def run_lines(manifest: PluginManifest) -> list[str]:
        return [f"{row['kind']} {row['label']}: {row['command']}" for row in manifest.run_rows()]
