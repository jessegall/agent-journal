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

    def now(self) -> T:
        if time.monotonic() - self.asked_at >= self.kept_for and self._asking.acquire(blocking=False):
            threading.Thread(target=self.asked_again, name="kept-answer", daemon=True).start()
        return self.value

    def given(self) -> T:
        return self.now() if self.asked_on else self.fresh()

    def fresh(self) -> T:
        self.value, self.asked_at, self.asked_on = self.ask(), time.monotonic(), time.time()
        return self.value

    def forget(self) -> None:
        self.asked_at = 0.0

    def is_asking(self) -> bool:
        return self._asking.locked()

    def drop(self) -> None:
        self.asked_at = self.asked_on = 0.0

    def asked_again(self) -> None:
        try:
            self.fresh()
        finally:
            self._asking.release()
