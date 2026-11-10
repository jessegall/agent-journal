from enum import StrEnum


class AgentSessionState(StrEnum):
    """Whether an agent's session can start another process."""

    READY = "ready"
    RUNNING = "running"
    BLOCKED = "blocked"
