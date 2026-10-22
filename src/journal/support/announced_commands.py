import shlex
import threading
from collections import deque

COMMAND_COUNT = 50


class AnnouncedCommands:
    """The shell commands a Claude subagent's PreToolUse hooks announced, by environment and by the session the subagent's agent runs in, each as the texts of the call's own parts, until the shim's own post from that session claims it, a part of it running journal with exactly that argv; the agent's own run of the same parts withdraws the announcement, and one still announced is asked for by its parts."""

    def __init__(self) -> None:
        self.lock = threading.Lock()
        self.announced: dict[tuple[str, str | None], deque[tuple[str, ...]]] = {}

    def note(self, environment: str, session: str | None, parts: tuple[str, ...]) -> None:
        with self.lock:
            self.announced.setdefault((environment, session), deque(maxlen=COMMAND_COUNT)).append(parts)

    def claim(self, environment: str, session: str | None, argv: list[str]) -> bool:
        with self.lock:
            for parts in self.announced.get((environment, session), ()):
                if any(self.runs_journal(part, argv) for part in parts):
                    self.announced[(environment, session)].remove(parts)
                    return True
        return False

    @staticmethod
    def runs_journal(part: str, argv: list[str]) -> bool:
        try:
            tokens = shlex.split(part)
        except ValueError:
            tokens = part.split()
        command = ["journal", *argv]
        return any(tokens[i:i + len(command)] == command for i in range(len(tokens) - len(command) + 1))

    def is_announced(self, environment: str, session: str | None, parts: tuple[str, ...]) -> bool:
        with self.lock:
            return parts in self.announced.get((environment, session), ())

    def withdraw(self, environment: str, session: str | None, parts: tuple[str, ...]) -> None:
        with self.lock:
            remaining = [announced for announced in self.announced.get((environment, session), ()) if announced != parts]
            self.announced[(environment, session)] = deque(remaining, maxlen=COMMAND_COUNT)
