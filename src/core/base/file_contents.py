from dataclasses import dataclass
from os import stat_result


@dataclass(frozen=True)
class FileContents:
    """Cached file contents with the metadata that identifies their version."""

    modified_at: int
    size_bytes: int
    inode: int
    data: bytes

    def matches(self, status: stat_result) -> bool:
        return self.modified_at == status.st_mtime_ns and self.size_bytes == status.st_size and self.inode == status.st_ino
