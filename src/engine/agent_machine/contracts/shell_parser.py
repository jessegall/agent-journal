from abc import ABC, abstractmethod

from engine.driver.shell_line import ShellLine


class ShellParser(ABC):
    """Parses a shell line into the parts the hook client sends for it, so a line a transform rewrote
    is judged by the same parser as the line the agent asked for (doc 1310 sections 4.1 and 6.7).
    The drivers module binds it."""

    @abstractmethod
    def line(self, text: str) -> ShellLine: ...
