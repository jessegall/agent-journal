from journal.db.commit_queue import CommitQueue
from journal.events.models.updated import Updated
from journal.events.listener import Listener
from journal.features.plugins.support.plugin_relay import PluginRelay
from journal.features.plugins.support.plugin_updated import PluginUpdated
from journal.support.listener_queue import ListenerQueue
from journal.support.actor import Actor
from journal.models.plugin import Plugin
from journal.repositories.scope import Scope


class PluginSettingsNotice(Listener[Updated]):
    """A plugin's settings changed by someone other than itself: the plugin hears plugin.updated with its settings, after the write commits."""

    def __init__(self, relay: PluginRelay, deferred: ListenerQueue, commits: CommitQueue, scope: Scope) -> None:
        self.relay, self.deferred, self.commits, self.scope = relay, deferred, commits, scope

    def handle(self, event: Updated) -> None:
        plugin = event.model
        if not isinstance(plugin, Plugin) or "settings" not in event.changed() or event.actor == Actor.plugin(plugin.name):
            return
        if not plugin.enabled or "plugin.updated" not in plugin.manifest.events:
            return
        environment_id = self.scope.id_default(0)
        notified = PluginUpdated(settings=plugin.settings)
        self.commits.add(lambda: self.deferred.add(lambda: self.relay.postponed(plugin, notified, environment_id)))
