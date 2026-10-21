from journal.db.connection import Connection
from journal.events.models.model_event import ModelEvent
from journal.events.listener import Listener
from journal.features.plugins.support.plugin_relay import PluginRelay
from journal.support.deferred import Deferred
from journal.support.scope import Scope


class PluginsHearRows(Listener[ModelEvent]):
    """The plugins that hear a row's change hear it after the write commits and after the reply, so none holds the database, hears a row rolled back or stops the save."""

    def __init__(self, relay: PluginRelay, deferred: Deferred, connection: Connection, scope: Scope) -> None:
        self.relay, self.deferred, self.connection, self.scope = relay, deferred, connection, scope

    def handle(self, event: ModelEvent) -> None:
        environment_id = self.scope.id_or(0)
        for plugin in self.relay.heard_by(event, environment_id):
            self.connection.after_commit(lambda plugin=plugin: self.deferred.add_unless_behind(lambda: self.relay.later(plugin, event, environment_id), f"{plugin.name} relay {event.key}"))
