from server.listener_thread import ListenerThread
from core.base.listener.commit_listener_runner import CommitListenerRunner


class ListenerWake(CommitListenerRunner):
    """Stands in for the commit listener runner in the server's requests: a request only wakes the listener thread,
    so no request thread ever runs a commit listener."""

    def __init__(self, thread: ListenerThread) -> None:
        self.listener_thread = thread

    def run(self) -> None:
        self.listener_thread.wake()
