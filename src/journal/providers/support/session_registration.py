import json
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class SessionRegistration:
    """A running Claude Code session's entry in its registry: the session it runs and the socket its inbox listens on, when it has one."""

    session: str
    socket_path: str | None

    @classmethod
    def read(cls, path: Path) -> "SessionRegistration":
        data = json.loads(path.read_text())
        return cls(str(data["sessionId"]), data.get("messagingSocketPath"))
