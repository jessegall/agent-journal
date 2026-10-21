import threading
from collections import deque

KEPT = 50


class AnnouncedCommands:
    """The shell commands a Claude subagent's PreToolUse hooks announced, by environment, each as the texts of the call's own parts, until the shim's own post claims it with every word of its argv; the agent's own run of the same parts withdraws the announcement, and one still announced is asked for by its parts."""

    def __init__(self) -> None:
        self.lock = threading.Lock()
        self.announced: dict[str, deque[tuple[str, ...]]] = {}

    def note(self, environment: str, parts: tuple[str, ...]) -> None:
        with self.lock:
            self.announced.setdefault(environment, deque(maxlen=KEPT)).append(parts)

    def claim(self, environment: str, argv: list[str]) -> bool:
        with self.lock:
            for parts in self.announced.get(environment, ()):
                if all(word in " ".join(parts) for word in argv):
                    self.announced[environment].remove(parts)
                    return True
        return False

    def is_announced(self, environment: str, parts: tuple[str, ...]) -> bool:
        with self.lock:
            return parts in self.announced.get(environment, ())

    def withdraw(self, environment: str, parts: tuple[str, ...]) -> None:
        with self.lock:
            remaining = [announced for announced in self.announced.get(environment, ()) if announced != parts]
            self.announced[environment] = deque(remaining, maxlen=KEPT)
