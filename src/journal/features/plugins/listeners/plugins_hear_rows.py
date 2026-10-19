from journal.db.connection import Connection
from journal.events.models.model_event import ModelEvent
from journal.events.listener import Listener
from journal.features.plugins.plugin_hearing import PluginHearing
from journal.support.deferred import Deferred
from journal.repositories.scope import Scope


class PluginsHearRows(Listener[ModelEvent]):
    """The plugins that hear a row's change hear it after the write commits and after the reply, so none holds the database, hears a row rolled back or stops the save."""

    def __init__(self, hearing: PluginHearing, deferred: Deferred, connection: Connection, scope: Scope) -> None:
        self.hearing, self.deferred, self.connection, self.scope = hearing, deferred, connection, scope

    def handle(self, event: ModelEvent) -> None:
        environment_id = self.scope.id_or(0)
        for plugin in self.hearing.heard_by(event, environment_id):
            self.connection.after_commit(lambda plugin=plugin: self.deferred.add(lambda: self.hearing.later(plugin, event, environment_id)))
