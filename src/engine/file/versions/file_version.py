from dataclasses import dataclass, field
from datetime import datetime, timezone
from engine.file.versions.file_changes import FileChanges
from engine.time.timestamp import Timestamp

NANOSECONDS = 1_000_000_000


@dataclass(frozen=True)
class FileVersion:
    """The file metadata that identifies one version of its contents."""

    modified_at: int
    size_bytes: int
    inode: int
    revision: int
    changes: FileChanges = field(compare=False, repr=False)

    def modified_timestamp(self) -> Timestamp:
        return Timestamp(datetime.fromtimestamp(self.modified_at / NANOSECONDS, timezone.utc))
