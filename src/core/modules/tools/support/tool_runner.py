from abc import ABC, abstractmethod
from pathlib import Path

from core.modules.tools.support.tool_definition import ToolDefinition
from core.modules.tools.support.tool_status import ToolStatus


class ToolRunner(ABC):
    """One tool a suite ships for the Tools page: what it is, and the work the tool commands ask of it, installing
    it, refreshing its output in a folder and copying that output into a new checkout."""

    @property
    @abstractmethod
    def definition(self) -> ToolDefinition: ...

    @abstractmethod
    def is_installed(self) -> bool: ...

    @abstractmethod
    def is_failed(self, folder: Path) -> bool: ...

    @abstractmethod
    def status(self, folder: Path) -> ToolStatus: ...

    @abstractmethod
    def install(self, folder: Path) -> None: ...

    @abstractmethod
    def refresh(self, folder: Path) -> ToolStatus: ...

    @abstractmethod
    def tick(self, folder: Path) -> ToolStatus: ...

    @abstractmethod
    def copy_output(self, source: Path, target: Path) -> list[str]:
        """Copies what a new checkout needs of the tool's output and names the folders it wrote."""
