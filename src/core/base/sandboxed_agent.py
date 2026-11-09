from typing import Protocol

from core.base.metadata import Metadata


class SandboxedAgent(Protocol):
    """What the sandbox choice reads of an agent row."""

    @property
    def id(self) -> int: ...

    @property
    def role(self) -> str: ...

    @property
    def metadata(self) -> Metadata: ...
