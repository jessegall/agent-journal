from journal.events.journal_updated import JournalUpdated
from journal.events.listener import Listener
from journal.features.plugins.support.plugin_releases import PluginReleases
from journal.support.actor import Actor
from journal.support.listener_queue import ListenerQueue


class ReleaseUpgrade(Listener[JournalUpdated]):
    """Once the journal has been updated, every plugin installed from a release is upgraded to its newest release that runs on the new journal, after the boot and off any request."""

    def __init__(self, releases: PluginReleases, deferred: ListenerQueue) -> None:
        self.releases, self.deferred = releases, deferred

    def handle(self, event: JournalUpdated) -> None:
        self.deferred.add(lambda: self.releases.upgraded_all(event.current, Actor.system()))
