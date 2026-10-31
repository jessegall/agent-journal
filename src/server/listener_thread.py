import threading
from collections.abc import Callable

LISTENER_PERIOD_SECONDS = 60.0
STOP_LIMIT_SECONDS = 1.5


class ListenerThread:
    """The server's one runner of commit listeners: a thread that runs a round when a write wakes it, and once
    a period besides, so events a direct run logged are handled too. An error in a round is reported and the
    next round runs. A stop signals the thread at once and never waits long for a round that is running."""

    def __init__(self, round_runner: Callable[[], None], error_reporter: Callable[[Exception], None], period_seconds: float = LISTENER_PERIOD_SECONDS,
                 name: str = "listeners") -> None:
        self.round_runner, self.error_reporter, self.period_seconds = round_runner, error_reporter, period_seconds
        self.wake_event, self.stop_event = threading.Event(), threading.Event()
        self.thread = threading.Thread(target=self.loop, name=name, daemon=True)

    def start(self) -> None:
        self.thread.start()

    def wake(self) -> None:
        self.wake_event.set()

    def loop(self) -> None:
        while not self.stop_event.is_set():
            self.wake_event.wait(self.period_seconds)
            self.wake_event.clear()
            if self.stop_event.is_set():
                return
            try:
                self.round_runner()
            except Exception as error:
                self.error_reporter(error)

    def signal_stop(self) -> None:
        self.stop_event.set()
        self.wake_event.set()

    def join(self, limit_seconds: float) -> None:
        if self.thread.is_alive():
            self.thread.join(max(0.0, limit_seconds))

    def stop(self) -> None:
        """Ends the thread after the round it runs, waiting at most STOP_LIMIT_SECONDS for that round; a round still
        running then is left to die with the server, whose writes SQLite rolls back."""
        self.signal_stop()
        self.join(STOP_LIMIT_SECONDS)
