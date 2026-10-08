from features.base import Feature
from features.connection.commands import ConnectToServer, HandEnvironment, PullCode, PushCode, SyncWithServer, transport_for
from features.connection.details import ConnectionDetails
from features.connection.linking import fail_to_join, join
from features.journal import Journal
from resources.base import Refused


class ConnectionFeature(Feature):
    details = ConnectionDetails

    def register(self, journal: Journal) -> None:
        for command in (ConnectToServer(), HandEnvironment(), SyncWithServer(), PushCode(), PullCode()):
            journal.commands.add("environment", command)

    def settings_changed(self, record, actor: str) -> None:
        address = str(self.values(record).address)
        if not address:
            return
        try:
            join(record, transport_for(address))
        except (Refused, OSError) as error:
            fail_to_join(record, error)
