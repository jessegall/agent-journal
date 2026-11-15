from contextlib import contextmanager
from types import SimpleNamespace

from engine.driver.wake_reply import WakeReply
from server.door.hosted_journal_door import HostedJournalDoor
from server.door.socket_peer import SocketPeer
from server.endpoints import wake_endpoint
from server.endpoints.wake_endpoint import WakeEndpoint


class HookDatabase:
    """The hooks' database lane, which keeps whether it is in use."""

    def __init__(self) -> None:
        self.in_use = False

    @contextmanager
    def used(self, priority, wait_seconds, owner="", event_name="hook"):
        self.in_use = True
        try:
            yield object()
        finally:
            self.in_use = False


class WaitingRoute:
    """A wake route whose ask waits, and which keeps whether the database lane was in use while it waited."""

    def __init__(self, lane: HookDatabase) -> None:
        self.lane, self.waited_in_use = lane, None

    def answer(self, ask):
        return WakeReply.waiting(3, ask.token)

    def waited(self, waiting, seconds):
        self.waited_in_use = self.lane.in_use
        return WakeReply.nothing()


def test_the_wake_routes_are_not_counted_by_the_database_queue(monkeypatch):
    lane = HookDatabase()
    route = WaitingRoute(lane)
    monkeypatch.setattr(wake_endpoint, "synced_database_container", lambda home, database: SimpleNamespace(get=lambda route_type: route))
    context = SimpleNamespace(hook_database=lane, hook_limit_seconds=5, home=object())
    reply = WakeEndpoint(context).answer({"program": "claude", "session": "s-1", "launch": "", "token": "t-1"})  # type: ignore[arg-type]
    assert reply == WakeReply.nothing() and route.waited_in_use is False


def test_the_door_lets_the_wake_routes_through():
    door = HostedJournalDoor(owner_uid=501)
    agent_in_the_group = SocketPeer(pid=700, uid=502)
    assert door.refusal("/wake", agent_in_the_group) is None and door.refusal("/wake/received", agent_in_the_group) is None
