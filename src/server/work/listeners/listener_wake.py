from server.work.listeners.listener_wake_router import ListenerWakeRouter
from engine.listener.commit.commit_listener_runner import CommitListenerRunner


class ListenerWake(CommitListenerRunner):
    """Stands in for the commit listener runner in the server's requests: a request only wakes the listener
    thread, so no request thread ever runs a commit listener."""

    def __init__(self, wakes: ListenerWakeRouter) -> None:
        self.wakes = wakes

    def run(self) -> None:
        self.wakes.wake()
