import re
from dataclasses import dataclass


@dataclass(frozen=True)
class PluginHealth:
    """How a plugin's services answer a health check: the variable naming each service's health socket, the
    request written there, and the answer wanted back, where a part in angle brackets matches anything."""

    socket_variable: str
    request: str
    answer: str

    def matches(self, received: str) -> bool:
        pattern = ".*".join(re.escape(part) for part in re.split(r"<[^>]*>", self.answer))
        return re.fullmatch(pattern, received.strip()) is not None
