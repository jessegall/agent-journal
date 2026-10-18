import hashlib
from pathlib import Path

from journal.engine.cards import Cards
from journal.features.plugins.plugin_folders import PluginFolders
from journal.models.plugin_manifest import PluginManifest
from journal.models.actor import Actor
from journal.models.plugin import Plugin
from journal.repositories.plugins import Plugins


class PluginHashes:
    """The hash of each file a plugin runs, taken when you install, upgrade or switch it on and checked before each run; a plugin whose files changed is switched off with a card, until you switch it on again."""

    def __init__(self, folders: PluginFolders, plugins: Plugins, cards: Cards) -> None:
        self.folders, self.plugins, self.cards = folders, plugins, cards

    def of(self, folder: Path, manifest: PluginManifest) -> dict[str, str]:
        return {path: self.hashed(folder / path) for path in manifest.programs}

    def intact(self, plugin: Plugin, environment_id: int) -> bool:
        changed = [path for path, was in plugin.hashes.items() if self.hashed(self.folders.of(plugin) / path) != was]
        if not changed:
            return True
        self.plugins.save(self.plugins.named(plugin.name).with_(enabled=False), Actor.system())
        self.cards.show(environment_id, "", f"Plugin {plugin.name} is off: {', '.join(changed)} changed since you installed it or switched it on. Read the change, then switch it on with journal plugin enable {plugin.name}", "bolt", tone="bad")
        return False

    @staticmethod
    def hashed(path: Path) -> str:
        return hashlib.sha256(path.read_bytes()).hexdigest() if path.is_file() else ""
