from typing import Any, Protocol


class SandboxedAgent(Protocol):
    """What the sandbox choice reads of an agent row."""

    id: int
    role: str
    metadata: Any
