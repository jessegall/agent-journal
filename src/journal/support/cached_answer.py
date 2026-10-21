import threading
import time
from typing import Callable, Generic, TypeVar

T = TypeVar("T")


class CachedAnswer(Generic[T]):
    """An answer that takes long to ask, such as a program's status or a round trip: kept and given at once, so no request waits on it; one older than its time is asked again on a thread of its own, one ask at a time, and the next reader has it."""

    def __init__(self, ask: Callable[[], T], kept_for: float, first: T) -> None:
        self.ask, self.kept_for = ask, kept_for
        self.value, self.asked_at, self.asked_on = first, 0.0, 0.0
        self._asking = threading.Lock()

    def time(self) -> T:
        if time.monotonic() - self.asked_at >= self.kept_for and self._asking.acquire(blocking=False):
            threading.Thread(target=self.repeat, name="kept-answer", daemon=True).start()
        return self.value

    def supplied(self) -> T:
        return self.time() if self.asked_on else self.is_recent()

    def is_recent(self) -> T:
        self.value, self.asked_at, self.asked_on = self.ask(), time.monotonic(), time.time()
        return self.value

    def discard(self) -> None:
        self.asked_at = 0.0

    def is_asking(self) -> bool:
        return self._asking.locked()

    def drop(self) -> None:
        self.asked_at = self.asked_on = 0.0

    def repeat(self) -> None:
        try:
            self.is_recent()
        finally:
            self._asking.release()
