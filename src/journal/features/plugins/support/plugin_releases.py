from journal.chat.cards import Cards
from journal.features.plugins.support.plugin_installing import PluginInstalling
from journal.features.updates.support.release import Release
from journal.features.updates.support.release_source import ReleaseSource
from journal.models.plugin import Plugin
from journal.repositories.environments import Environments
from journal.repositories.plugins import Plugins
from journal.support.actor import Actor
from journal.support.card_kind import CardKind
from journal.support.rejection import Rejection


class PluginReleases:
    """The installed plugins brought to the journal's version: each one installed from a source moves to its newest release whose manifest's journal field, the least journal version it runs on, the running journal meets, and the chat is told what moved."""

    def __init__(self, plugins: Plugins, installing: PluginInstalling, source: ReleaseSource, cards: Cards, environments: Environments) -> None:
        self.plugins, self.installing, self.source, self.cards, self.environments = plugins, installing, source, cards, environments

    def upgraded_all(self, version: str, actor: Actor) -> None:
        for plugin in [plugin for plugin in self.plugins.all() if not plugin.linked and plugin.release]:
            self.upgraded(plugin, version, actor)

    def upgraded(self, plugin: Plugin, version: str, actor: Actor) -> None:
        try:
            tag = self.fitting_tag(plugin, Release(version))
            if tag is None:
                return
            environment = self.environments.all()[0]
            self.installing.upgrade(plugin.name, tag, environment.name, actor)
        except (OSError, Rejection) as failed:
            self.cards.show(self.environments.all()[0].row_id, "", f"Plugin {plugin.name} was not upgraded for journal {version}: {failed}", "plug", tone="bad", shows=CardKind.PLUGINS)
            return
        self.cards.show(environment.row_id, "", f"Plugin {plugin.name} upgraded from {plugin.release} to {tag} for journal {version}", "plug", tone="good", shows=CardKind.PLUGINS)

    def fitting_tag(self, plugin: Plugin, journal: Release) -> str | None:
        newer = [release for release in reversed(Release.lookup(self.source.release_tags(plugin.source))) if release.is_newer(Release(plugin.release))]
        return next((release.tag for release in newer if self.is_compatible(plugin, release.tag, journal)), None)

    def is_compatible(self, plugin: Plugin, tag: str, journal: Release) -> bool:
        with self.installing.staged(plugin.source, tag) as (folder, _):
            least = self.installing.reader.least_journal(folder)
        return not least or not Release(least).is_newer(journal)
