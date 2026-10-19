import threading
import time

MOST_WRONG = 5
LOCKED_FOR = 15 * 60


class WrongPasswords:
    """Wrong passwords sent to links, counted per place they come from, so a link's password cannot be guessed without limit."""

    def __init__(self) -> None:
        self.lock = threading.Lock()
        self.tries: dict[str, list[float]] = {}

    def recent(self, place: str) -> list[float]:
        since = time.time() - LOCKED_FOR
        return [at for at in self.tries.get(place, []) if at > since]

    def locked(self, place: str) -> bool:
        with self.lock:
            return len(self.recent(place)) >= MOST_WRONG

    def count(self, place: str) -> None:
        with self.lock:
            self.tries[place] = [*self.recent(place), time.time()]
