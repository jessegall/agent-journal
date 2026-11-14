from dataclasses import dataclass


@dataclass(frozen=True)
class ClaudeSessionEntry:
    """A running Claude Code session's entry in its registry: the process it runs in and the socket its inbox
    listens on, empty when it has none."""

    pid: str
    socket_path: str
