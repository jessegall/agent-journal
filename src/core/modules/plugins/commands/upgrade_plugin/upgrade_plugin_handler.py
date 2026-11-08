import shutil
from pathlib import Path

from core.base.plugin_script_processes import PluginScriptProcesses
from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.user_approval_refusal import UserApprovalRefusal
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.file_access import FileAccess
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.plugins.commands.upgrade_plugin.upgrade_plugin import UpgradePlugin
from core.modules.plugins.queries.plugin_query import PluginQuery
from core.modules.plugins.support.plugin_code_diff import PluginCodeDiff
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
    """Fetches a plugin's source and, once confirmed, sets the new code up next to the old and
    replaces the old code with it before the transaction opens, so a failing step leaves the old one in
    place; the preview also shows the diff of the files, and a running service is started again by the
    server's next round of services, which sees the plugin's new digest."""

    command = UpgradePlugin
    runs_once = True

    def __init__(self, plugins: PluginQuery, folders: PluginFolders, staging: PluginStaging, steps: PluginInstallSteps, repository: Repository, skill_files: PluginSkillFiles, readers: PluginReaders, code_diff: PluginCodeDiff, scripts: PluginScriptProcesses) -> None:
        self.plugins, self.folders, self.staging, self.steps, self.repository, self.skill_files, self.readers, self.code_diff, self.scripts = plugins, folders, staging, steps, repository, skill_files, readers, code_diff, scripts

    def prepare(self, command: UpgradePlugin, actor: Actor) -> None:
        if actor.type is ActorType.AGENT:
            raise UserApprovalRefusal(f"Upgrade the plugin {command.name}?", command=UpgradePlugin(command.name, True))
        plugin = self.plugins.find_name(command.name)
        source = self.staging.fetched(plugin.source)
        manifest = PluginManifest.read(source)
        if manifest.name != plugin.name:
            self.staging.cleared(plugin.source)
            raise Refusal(f"the source of {plugin.name} now contains a plugin called {manifest.name}", "install that one under its own name")
        if not command.confirmed:
            return
        self.steps.check_requirements(manifest, source)
        mark = self.folders.upgrade_mark(plugin.name)
        FileAccess.shared().update_timestamp(mark)
        self.scripts.stop(plugin.name)
        try:
            self.replaced(manifest, source, self.folders.code(plugin.name))
        except Exception:
            mark.unlink(missing_ok=True)
            raise

    def replaced(self, manifest: PluginManifest, source: Path, code: Path) -> None:
        new_code, old_code = code.with_name(code.name + NEW_SUFFIX), code.with_name(code.name + OLD_SUFFIX)
        shutil.rmtree(new_code, ignore_errors=True)
        try:
            shutil.copytree(source, new_code, ignore=EXCLUDED_NAMES)
            self.steps.run_setup(manifest, new_code)
        except Exception:
            shutil.rmtree(new_code, ignore_errors=True)
            raise
        shutil.rmtree(old_code, ignore_errors=True)
        code.rename(old_code)
        new_code.rename(code)
        shutil.rmtree(old_code, ignore_errors=True)

    def handle(self, command: UpgradePlugin, context: Context) -> PluginUpgrade:
        plugin = self.plugins.find_name(command.name)
        code = self.folders.code(plugin.name)
        if not command.confirmed:
            offered_folder = self.staging.folder(plugin.source)
            old, offered = PluginManifest.read(code), PluginManifest.read(offered_folder)
            diff = self.code_diff.lines(code, offered_folder)
            self.staging.cleared(plugin.source)
            return PluginUpgrade(plugin.name, plugin.release, offered.version, self.changes(old, offered), False, diff)
        self.staging.cleared(plugin.source)
        manifest = PluginManifest.read(code)
        self.skill_files.publish(code, manifest)
        self.readers.publish(code, manifest.name, context)
        self.repository.save(plugin.changed(release=manifest.version, files_digest=PluginDigest.digest(code, manifest)), context)
        self.folders.upgrade_mark(plugin.name).unlink(missing_ok=True)
        return PluginUpgrade(plugin.name, plugin.release, manifest.version, [], True)

    @staticmethod
    def changes(old: PluginManifest, offered: PluginManifest) -> list[str]:
        previous, after = UpgradePluginHandler.run_lines(old), UpgradePluginHandler.run_lines(offered)
        return [*(f"no longer {line}" for line in previous if line not in after), *(f"new {line}" for line in after if line not in previous)]

    @staticmethod
    def run_lines(manifest: PluginManifest) -> list[str]:
        return [f"{row['category']} {row['label']}: {row['command']}" for row in manifest.run_rows()]
