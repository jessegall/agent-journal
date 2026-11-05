import threading
import time
from collections import deque
from collections.abc import Callable

CODES_ALLOWED = 5
WINDOW_SECONDS = 60.0


class WrongCodeLimit:
    """Takes at most five pairing codes a minute, counted when each arrives under one lock, so codes sent at
    the same moment cannot all slip past the limit and a code cannot be guessed by trying many."""

    def __init__(self, seconds: Callable[[], float] = time.monotonic) -> None:
        self.seconds, self.lock, self.attempt_times = seconds, threading.Lock(), deque[float]()

    def admits(self) -> bool:
        with self.lock:
            while self.attempt_times and self.seconds() - self.attempt_times[0] > WINDOW_SECONDS:
                self.attempt_times.popleft()
            if len(self.attempt_times) >= CODES_ALLOWED:
                return False
            self.attempt_times.append(self.seconds())
            return True
