from pathlib import Path

from journal.config import Config
from journal.features.aliases.support.alias_names import AliasNames
from journal.features.plugins.support.plugin_folders import PluginFolders
from journal.features.plugins.support.plugin_skills import STAMP
from journal.models.plugin import Plugin
from journal.repositories.aliases import Aliases
from journal.support.actor import Actor

READERS = ".journal-plugin/readers"


class PluginAliases:
    """A plugin's aliases kept as the project's with the plugin named on each, a name already taken passed over, and the readers in its folder's .journal-plugin/readers copied into the project's readers stamped with the plugin's name, a reader of the project's own left as it is; both taken away with the plugin."""

    def __init__(self, config: Config, aliases: Aliases, names: AliasNames, folders: PluginFolders) -> None:
        self.config, self.aliases, self.names, self.folders = config, aliases, names, folders

    def publish(self, plugin: Plugin, actor: Actor) -> None:
        folder = self.folders.folder(plugin)
        for alias in plugin.manifest.aliases:
            if not self.names.refusal(alias.name):
                self.aliases.save(alias.row(folder, plugin.name), actor)
        self.config.readers.mkdir(parents=True, exist_ok=True)
        for reader in sorted((folder / READERS).glob("*.pattern")):
            copy = self.config.readers / reader.name
            if not copy.exists() or self.is_stamped(copy, plugin):
                copy.write_text(reader.read_text().rstrip("\n") + f"\n{STAMP}{plugin.name}\n")

    def skipped(self, plugin: Plugin) -> set[str]:
        return plugin.manifest.alias_names() - {alias.name for alias in self.aliases.plugin_rows(plugin.name)}

    def withdraw(self, plugin: Plugin, actor: Actor) -> None:
        for alias in self.aliases.plugin_rows(plugin.name):
            self.aliases.delete(alias, actor)
        for copy in self.config.readers.glob("*.pattern"):
            if self.is_stamped(copy, plugin):
                copy.unlink()

    @staticmethod
    def is_stamped(copy: Path, plugin: Plugin) -> bool:
        return f"\n{STAMP}{plugin.name}\n" in copy.read_text()
