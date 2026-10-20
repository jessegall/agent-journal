import threading
from collections import deque

from journal.support.chain import Chain

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

    def holds_line(self, environment: str, line: str) -> bool:
        """Whether a subagent announced a command that is this line's own commands; the announcement stays."""
        with self.lock:
            return any(Chain.own(command) == Chain.own(line) for command in self.announced.get(environment, ()))

    def withdraw(self, environment: str, line: str) -> None:
        """The agent's own run of a command supersedes a subagent's earlier announcement of it."""
        with self.lock:
            kept = [command for command in self.announced.get(environment, ()) if Chain.own(command) != Chain.own(line)]
            self.announced[environment] = deque(kept, maxlen=KEPT)
