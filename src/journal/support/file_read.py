from dataclasses import dataclass
from pathlib import Path

from journal.support.file_lines import FileLines
from journal.support.operation import Operation


@dataclass(frozen=True)
class FileRead(Operation):
    """A file read by the program's own read tool, all of it or a part."""

    kind = "file read"
    path: str
    partial: bool

    def read_paths(self) -> tuple[str, ...]:
        return (self.path,) if self.path else ()

    def file_lines(self) -> int:
        return FileLines.build(Path(self.path).expanduser()) if self.path and not self.partial else 0
