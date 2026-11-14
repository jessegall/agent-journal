import threading
import time
from collections import deque
from collections.abc import Callable

CODES_ALLOWED = 5
WINDOW_SECONDS = 60.0


class WrongCodeLimit:
    """Accepts at most a number of codes or passwords in a window, five pairing codes a minute by default,
    counted when each arrives under one lock, so codes sent at the same moment cannot all get past the limit
    and a code cannot be guessed by trying many."""

    def __init__(self, seconds: Callable[[], float] = time.monotonic, allowed: int = CODES_ALLOWED, window_seconds: float = WINDOW_SECONDS) -> None:
        self.seconds, self.lock, self.attempt_times = seconds, threading.Lock(), deque[float]()
        self.allowed, self.window_seconds = allowed, window_seconds

    def admits(self) -> bool:
        with self.lock:
            while self.attempt_times and self.seconds() - self.attempt_times[0] > self.window_seconds:
                self.attempt_times.popleft()
            if len(self.attempt_times) >= self.allowed:
                return False
            self.attempt_times.append(self.seconds())
            return True

    # Gives an attempt that turned out right back, so only wrong ones count toward the limit.
    def remove_newest_attempt(self) -> None:
        with self.lock:
            if self.attempt_times:
                self.attempt_times.pop()
