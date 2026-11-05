from dataclasses import dataclass, field
from core.base.file_changes import FileChanges


@dataclass(frozen=True)
class FileVersion:
    """The file metadata that identifies one version of its contents."""

    modified_at: int
    size_bytes: int
    inode: int
    revision: int
    changes: FileChanges = field(compare=False, repr=False)
