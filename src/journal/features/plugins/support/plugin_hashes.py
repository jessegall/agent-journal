import hashlib
from pathlib import Path

from journal.chat.moment_cards import MomentCards
from journal.features.plugins.support.plugin_folders import PluginFolders
from journal.models.support.plugin_manifest import PluginManifest
from journal.support.actor import Actor
from journal.models.plugin import Plugin
from journal.repositories.plugins import Plugins
from journal.support.card_kind import CardKind


class PluginHashes:
    """The hash of each file a plugin runs, taken when you install, upgrade or switch it on and checked before each run; a plugin whose files changed is switched off with a card, until you switch it on again."""

    def __init__(self, folders: PluginFolders, plugins: Plugins, cards: MomentCards) -> None:
        self.folders, self.plugins, self.cards = folders, plugins, cards
        self.checked: dict[Path, tuple[int, int, str]] = {}

    def digest(self, folder: Path, manifest: PluginManifest) -> dict[str, str]:
        return {path: self.hashed(folder / path) for path in manifest.programs}

    def intact(self, plugin: Plugin, environment_id: int) -> bool:
        changed = [path for path, prior_row in plugin.hashes.items() if self.hashed(self.folders.folder(plugin) / path) != prior_row]
        if not changed:
            return True
        self.plugins.save(self.plugins.lookup(plugin.name).with_(enabled=False), Actor.system())
        self.cards.show(environment_id, "", f"Plugin {plugin.name} is off: {', '.join(changed)} changed since you installed it or switched it on. Read the change, then switch it on with journal plugin enable {plugin.name}", "bolt", tone="bad", shows=CardKind.PLUGINS)
        return False

    def hashed(self, path: Path) -> str:
        if not path.is_file():
            return ""
        stat = path.stat()
        record = self.checked.get(path)
        if record and record[0] == stat.st_mtime_ns and record[1] == stat.st_size:
            return record[2]
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        self.checked[path] = (stat.st_mtime_ns, stat.st_size, digest)
        return digest
