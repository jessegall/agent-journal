from dataclasses import dataclass

from engine.enums.file_status import FileStatus


@dataclass(frozen=True)
class FileState:
    """How a file of a checkout stands against its base: its status, and whether the base commit holds its name."""

    status: FileStatus
    base_contains: bool
