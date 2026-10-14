from events import Fact
from events.agents import ClockTicked
from events.plugins import PluginCompleted, PluginManifestChanged, PluginRemoved, PluginsWorthOffering
from framework.plugins.declared import called
from framework.plugins.lifecycle import changed_on_disk
from receiving import Listener
from resources.types import Plugin
from serving import ReadOwnWork, ReadRows


class SpotRemovedPlugin(Listener[PluginCompleted]):
    def listen(self, event: PluginCompleted, plugins: ReadRows[Plugin]) -> list[Fact]:
        name = called(plugins.peek(event.n))
        still = any(one.n != event.n and called(one) == name for one in plugins.rows.standing())
        return [PluginRemoved(plugin=event.n)] if name and not still else []


class SpotChangedManifests(Listener[ClockTicked]):
    def listen(self, event: ClockTicked, plugins: ReadRows[Plugin]) -> list[Fact]:
        return [PluginManifestChanged(plugin=row.n) for row in plugins.rows.standing() if changed_on_disk(plugins, row)]


class SpotFittingPlugins(Listener[ClockTicked]):
    def listen(self, event: ClockTicked, work: ReadOwnWork) -> list[Fact]:
        return [PluginsWorthOffering(agent=event.agent)] if work.fitting_wanted(event.agent) else []
