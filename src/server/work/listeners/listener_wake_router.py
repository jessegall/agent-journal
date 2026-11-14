from collections.abc import Callable, Sequence

from engine.event.written_events import WrittenEvents
from engine.listener.commit.listener_set import ListenerSet
from server.work.listeners.listener_thread import ListenerThread


class ListenerWakeRouter:
    """Wakes only the listener threads that hear an event the calling thread wrote, never reading the database; a
    thread that has not built its listeners yet is woken for any name, so it can learn them. A write outside the
    server is still met by each thread's own period."""

    def __init__(self, written: WrittenEvents, threads: Sequence[tuple[ListenerThread, Callable[[], ListenerSet | None]]]) -> None:
        self.written, self.threads = written, threads

    # one thread woken by any name written, for a server that runs every listener on one thread
    @classmethod
    def waking(cls, thread: ListenerThread) -> "ListenerWakeRouter":
        return cls(WrittenEvents.shared(), [(thread, lambda: None)])

    def wake(self) -> None:
        names = self.written.taken()
        if not names:
            return
        for thread, listener_set in self.threads:
            current = listener_set()
            if current is None or any(current.matches(name) for name in names):
                thread.wake()
