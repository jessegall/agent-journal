from dataclasses import dataclass
from engine.file.file_version import FileVersion


@dataclass(frozen=True)
class FileContents:
    """Cached file contents with the metadata that identifies their version."""

    version: FileVersion
    data: bytes
