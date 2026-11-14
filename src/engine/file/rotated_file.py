from engine.file.file_access import FileAccess
from pathlib import Path


class RotatedFile:
    """A file that is moved aside to <name>.1, replacing the older one, once it is past its size limit."""

    def __init__(self, path: Path, limit_bytes: int) -> None:
        self.path, self.limit_bytes = path, limit_bytes

    def rotate(self) -> bool:
        if not FileAccess.exists(self.path) or FileAccess.stat(self.path).st_size <= self.limit_bytes:
            return False
        FileAccess.replace(self.path, self.path.with_name(self.path.name + ".1"))
        return True
