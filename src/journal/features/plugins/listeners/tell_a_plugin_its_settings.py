from journal.db.connection import Connection
from journal.events.models.updated import Updated
from journal.events.listener import Listener
from journal.features.plugins.plugin_hearing import PluginHearing
from journal.features.plugins.plugin_updated import PluginUpdated
from journal.engine.deferred import Deferred
from journal.support.actor import Actor
from journal.models.plugin import Plugin
from journal.repositories.scope import Scope


class TellAPluginItsSettings(Listener[Updated]):
    """A plugin's settings changed by someone other than itself: the plugin hears plugin.updated with its settings, after the write commits."""

    def __init__(self, hearing: PluginHearing, deferred: Deferred, connection: Connection, scope: Scope) -> None:
        self.hearing, self.deferred, self.connection, self.scope = hearing, deferred, connection, scope

    def handle(self, event: Updated) -> None:
        plugin = event.model
        if not isinstance(plugin, Plugin) or "settings" not in event.changed() or event.by == Actor.plugin(plugin.name):
            return
        if not plugin.enabled or "plugin.updated" not in plugin.manifest.hears:
            return
        environment_id = self.scope.id_or(0)
        told = PluginUpdated(settings=plugin.settings)
        self.connection.after_commit(lambda: self.deferred.add(lambda: self.hearing.later(plugin, told, environment_id)))
