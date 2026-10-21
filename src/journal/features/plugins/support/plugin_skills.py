import shutil
from pathlib import Path

from journal.config import Config
from journal.features.plugins.support.manifest_reader import ManifestReader
from journal.features.plugins.support.plugin_folders import PluginFolders
from journal.support.skill_files import HOMES
from journal.models.plugin import Plugin
from journal.support.plugin_manifest import PluginManifest

STAMP = "plugin: "


class PluginSkills:
    """A plugin's skills published into the agents' skill folders beside the journal's, each stamped with the plugin's name and kept out of git by a .gitignore of its own; taken away when the plugin is switched off or removed."""

    def __init__(self, config: Config, folders: PluginFolders) -> None:
        self.config, self.folders = config, folders

    def publish(self, plugin: Plugin) -> None:
        folder = self.folders.of(plugin)
        manifest = plugin.manifest
        for name in ManifestReader.skill_names(folder, manifest):
            text = self.stamped((folder / manifest.skills / name / "SKILL.md").read_text(), plugin.name)
            for home in HOMES:
                published = self.config.root / home / name
                published.mkdir(parents=True, exist_ok=True)
                (published / "SKILL.md").write_text(text)
                (published / ".gitignore").write_text("*\n")

    def withdraw(self, plugin: Plugin) -> None:
        for home in HOMES:
            for skill in (self.config.root / home).glob("*/SKILL.md"):
                if f"\n{STAMP}{plugin.name}\n" in skill.read_text():
                    self.remove(skill.parent)

    @staticmethod
    def remove(folder: Path) -> None:
        if folder.is_symlink():
            folder.unlink()
        else:
            shutil.rmtree(folder)

    @staticmethod
    def stamped(text: str, name: str) -> str:
        if text.startswith("---\n"):
            return f"---\n{STAMP}{name}\n" + text[4:]
        return f"---\n{STAMP}{name}\n---\n\n{text}"
