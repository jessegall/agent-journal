from controllers.types import Environments
from expects import Answered, Given, Refused
from features.base import Feature
from features.connection.commands import ConnectToServer, DisconnectFromServer, HandEnvironment, PullCode, PushCode, ShowConnection, SyncWithServer, join_again
from features.connection.details import ConnectionDetails
from features.connection.routes import get_sync_hello, post_sync_events, post_sync_handback, post_sync_handover, post_sync_holder, post_sync_write
from features.journal import Journal

DISCONNECTED = "disconnected: nothing more is sent to the server, and what it already has stays there"
NAME_THE_SERVER = "name the server first: journal environment connect --address <address>, or its address in Settings"


class ConnectionFeature(Feature):
    details = ConnectionDetails

    def register(self, journal: Journal) -> None:
        journal.commands.add("environment", ConnectToServer(), expects=[
            Given((Environments,)) >> Refused(NAME_THE_SERVER),
        ])
        journal.commands.add("environment", DisconnectFromServer(), expects=[
            Given((Environments,), settings={"connection.address": "https://server.example"}) >> Answered(DISCONNECTED),
            Given((Environments,)) >> Answered(DISCONNECTED),
        ])
        journal.commands.add("environment", ShowConnection(), expects=[
            Given((Environments,)) >> Answered({"address": "", "connected": False, "release": "", "step": "", "travels": {"files": 0, "bytes": 0, "environments": ()},
                                                "role": "", "synced_at": 0.0, "has_key": False}),
        ])
        journal.commands.add("environment", HandEnvironment(), expects=[
            Given((Environments, "main", "the-laptop")) >> Refused(NAME_THE_SERVER),
        ])
        journal.commands.add("environment", SyncWithServer(), expects=[
            Given((Environments,)) >> Refused(NAME_THE_SERVER),
        ])
        journal.commands.add("environment", PushCode(), expects=[
            Given((Environments,)) >> Answered("pushed 0 repositories"),
        ])
        journal.commands.add("environment", PullCode(), expects=[
            Given((Environments, "v1")) >> Refused("no snapshot named v1 was found on the hosted remote of any repository here"),
        ])
        journal.routes.add(get_sync_hello, post_sync_handover, post_sync_handback, post_sync_holder, post_sync_write, post_sync_events)

    def settings_changed(self, record, actor: str) -> None:
        join_again(record, str(self.values(record).address))
