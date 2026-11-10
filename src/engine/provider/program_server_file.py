from abc import ABC, abstractmethod
from collections.abc import Sequence
from pathlib import Path

from engine.provider.tool_server import ToolServer


class ProgramServerFile(ABC):
    """An agent program's server configuration file."""

    def __init__(self, path: Path) -> None:
        self.path = path

    @abstractmethod
    def names(self) -> set[str]: ...

    @abstractmethod
    def write(self, servers: Sequence[ToolServer], dropped: Sequence[str]) -> None: ...

    def prepare(self, servers: Sequence[ToolServer]) -> None:
        self.write(servers, ())
