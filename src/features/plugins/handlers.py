from events import Fact
from events.plugins import PluginManifestChanged, PluginRemoved, PluginsWorthOffering
from receiving import Handler
from serving import OwnWork


class ClearRemovedPlugin(Handler[PluginRemoved]):
    def handle(self, event: PluginRemoved, work: OwnWork) -> list[Fact]:
        work.retire_plugin(event.plugin)
        return []


class ReadLinkedManifests(Handler[PluginManifestChanged]):
    def handle(self, event: PluginManifestChanged, work: OwnWork) -> list[Fact]:
        work.reread_manifest(event.plugin)
        return []


class SuggestFittingPlugins(Handler[PluginsWorthOffering]):
    def handle(self, event: PluginsWorthOffering, work: OwnWork) -> list[Fact]:
        work.look_for_fitting()
        return []
