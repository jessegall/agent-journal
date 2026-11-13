import threading
import time
from collections.abc import Callable

from server.viewer.wrong_code_limit import WrongCodeLimit

TRY_COUNT = 5
WINDOW_SECONDS = 15 * 60


class SharePasswordTries:
    """Wrong passwords sent to a link, counted per link under one lock before the password is compared, since a
    tunnel gives every visitor the same address, so a link's password cannot be guessed without limit, also by
    guesses sent at the same moment."""

    def __init__(self, seconds: Callable[[], float] = time.monotonic) -> None:
        self.seconds, self.lock, self.limits = seconds, threading.Lock(), dict[str, WrongCodeLimit]()

    def admits(self, token: str) -> bool:
        return self.limit(token).admits()

    def remove_newest_attempt(self, token: str) -> None:
        self.limit(token).remove_newest_attempt()

    def limit(self, token: str) -> WrongCodeLimit:
        with self.lock:
            return self.limits.setdefault(token, WrongCodeLimit(self.seconds, TRY_COUNT, WINDOW_SECONDS))
