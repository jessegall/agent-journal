import hashlib
import json

from journal.support.cards import Cards
from journal.features.plugins.support.manifest_reader import MANIFEST, ManifestReader
from journal.features.plugins.support.plugin_changes import PluginChanges
from journal.features.plugins.support.plugin_folders import PluginFolders
from journal.support.actor import Actor
from journal.models.plugin import Plugin
from journal.support.rejection import Rejection
from journal.repositories.plugins import Plugins
from journal.support.card_kind import CardKind


class LinkedManifests:
    """A linked folder's manifest changed since the user last read it: the plugin goes on as it was installed, and a card shows the change once, until the user applies it with an upgrade."""

    def __init__(self, folders: PluginFolders, plugins: Plugins, cards: Cards, reader: ManifestReader) -> None:
        self.folders, self.plugins, self.cards, self.reader = folders, plugins, cards, reader

    def notice(self, plugin: Plugin, environment_id: int) -> None:
        if not plugin.linked:
            return
        file = self.folders.folder(plugin) / MANIFEST
        text = file.read_text() if file.is_file() else ""
        viewed = hashlib.sha256(text.encode()).hexdigest()
        if viewed == plugin.waiting:
            return
        try:
            changes = PluginChanges.manifest(PluginChanges.plain(plugin.manifest), PluginChanges.plain(self.reader.read(self.folders.folder(plugin))))
        except (Rejection, json.JSONDecodeError) as refused:
            changes = [f"the manifest is refused: {refused}"]
        if not changes:
            return
        self.plugins.save(plugin.with_(waiting=viewed), Actor.system())
        self.cards.show(environment_id, "", f"Plugin {plugin.name}'s manifest changed in its folder; it runs as installed until you apply it with journal plugin upgrade {plugin.name} --yes", "plug", tone="warn", detail="\n".join(changes), shows=CardKind.PLUGINS)
