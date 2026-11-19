import shutil
from pathlib import Path

from journal.features.shell.support.reader import PLUGIN_OWNER_PREFIX
from journal.config import Config
from journal.features.plugins.support.manifest_reader import ManifestReader
from journal.features.plugins.support.plugin_folders import PluginFolders
from journal.features.skills.support.requirements import Requirements
from journal.features.skills.support.skill_files import HOMES, ready_folder
from journal.models.plugin import Plugin
from journal.models.support.plugin_manifest import PluginManifest
from journal.repositories.plugins import Plugins



class PluginSkills:
    """A plugin's skills published into the agents' skill folders beside the journal's, each stamped with the plugin's name and stored out of git by a .gitignore of its own; published afresh at every start, so none is stale or missing; taken away when the plugin is switched off or removed, and an agent's debt to a skill no longer published cleared."""

    def __init__(self, config: Config, folders: PluginFolders, plugins: Plugins, requirements: Requirements) -> None:
        self.config, self.folders, self.plugins, self.requirements = config, folders, plugins, requirements

    def refresh_all(self) -> None:
        for plugin in self.plugins.enabled():
            self.withdraw(plugin)
            self.publish(plugin)
        self.requirements.discharge_missing()

    def renew(self, plugin: Plugin) -> None:
        self.withdraw(plugin)
        if plugin.enabled:
            self.publish(plugin)
        self.requirements.discharge_missing()

    def retract(self, plugin: Plugin) -> None:
        self.withdraw(plugin)
        self.requirements.discharge_missing()

    def publish(self, plugin: Plugin) -> None:
        folder = self.folders.folder(plugin)
        manifest = plugin.manifest
        for name in ManifestReader.skill_names(folder, manifest):
            text = self.stamped((folder / manifest.skills / name / "SKILL.md").read_text(), plugin.name)
            for home in HOMES:
                published = self.config.root / home / name
                ready_folder(published)
                (published / "SKILL.md").write_text(text)
                (published / ".gitignore").write_text("*\n")

    def withdraw(self, plugin: Plugin) -> None:
        folder = self.folders.folder(plugin)
        for home in HOMES:
            for name in ManifestReader.skill_names(folder, plugin.manifest):
                self.clear_link(self.config.root / home / name)
            for skill in (self.config.root / home).glob("*/SKILL.md"):
                if f"\n{PLUGIN_OWNER_PREFIX}{plugin.name}\n" in skill.read_text():
                    self.remove(skill.parent)

    @staticmethod
    def remove(folder: Path) -> None:
        if folder.is_symlink():
            folder.unlink()
        else:
            shutil.rmtree(folder)

    @staticmethod
    def clear_link(path: Path) -> None:
        if path.is_symlink() or (path.exists() and not path.is_dir()):
            path.unlink()

    @staticmethod
    def stamped(text: str, name: str) -> str:
        if text.startswith("---\n"):
            return f"---\n{PLUGIN_OWNER_PREFIX}{name}\n" + text[4:]
        return f"---\n{PLUGIN_OWNER_PREFIX}{name}\n---\n\n{text}"
