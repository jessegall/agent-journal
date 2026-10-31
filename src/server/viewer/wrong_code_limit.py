import threading
import time
from collections import deque
from collections.abc import Callable

WRONG_CODES_ALLOWED = 5
WINDOW_SECONDS = 60.0


class WrongCodeLimit:
    """Counts wrong pairing codes over the last minute and stops taking codes after five, so a code cannot be
    guessed by trying them one after another."""

    def __init__(self, seconds: Callable[[], float] = time.monotonic) -> None:
        self.seconds, self.lock, self.wrong_at = seconds, threading.Lock(), deque[float]()

    def allows(self) -> bool:
        with self.lock:
            self.drop_old_entries()
            return len(self.wrong_at) < WRONG_CODES_ALLOWED

    def counted(self) -> None:
        with self.lock:
            self.wrong_at.append(self.seconds())

    def drop_old_entries(self) -> None:
        while self.wrong_at and self.seconds() - self.wrong_at[0] > WINDOW_SECONDS:
            self.wrong_at.popleft()
