from features.base import Feature
from features.connection.commands import ConnectToServer, DisconnectFromServer, HandEnvironment, PullCode, PushCode, ShowConnection, SyncWithServer, join_again
from features.connection.details import ConnectionDetails
from features.connection.routes import get_sync_hello, post_sync_events, post_sync_handback, post_sync_handover, post_sync_holder, post_sync_write
from features.journal import Journal


class ConnectionFeature(Feature):
    details = ConnectionDetails

    def register(self, journal: Journal) -> None:
        for command in (ConnectToServer(), DisconnectFromServer(), ShowConnection(), HandEnvironment(), SyncWithServer(), PushCode(), PullCode()):
            journal.commands.add("environment", command)
        journal.routes.add(get_sync_hello, post_sync_handover, post_sync_handback, post_sync_holder, post_sync_write, post_sync_events)

    def settings_changed(self, record, actor: str) -> None:
        join_again(record, str(self.values(record).address))
