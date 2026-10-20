import threading
from collections import deque

KEPT = 50


class AnnouncedCommands:
    """The shell commands a Claude subagent's PreToolUse hooks announced, by environment, until the shim's own post claims each one."""

    def __init__(self) -> None:
        self.lock = threading.Lock()
        self.announced: dict[str, deque[str]] = {}

    def note(self, environment: str, command: str) -> None:
        with self.lock:
            self.announced.setdefault(environment, deque(maxlen=KEPT)).append(command)

    def claim(self, environment: str, argv: list[str]) -> bool:
        """True, and the announcement is used up, when a command announced here holds every word of the argv."""
        with self.lock:
            for command in self.announced.get(environment, ()):
                if all(word in command for word in argv):
                    self.announced[environment].remove(command)
                    return True
        return False
