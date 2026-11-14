from functools import lru_cache
from pathlib import Path

from engine.file.file_access import FileAccess
from engine.file.versions.file_version import FileVersion

KEPT_FILES = 64


class KeptBytes:
    """Reads a file's bytes once for each version of it, so the places of one request that read the same file read
    it once."""

    @staticmethod
    def read(path: Path) -> bytes:
        return KeptBytes.kept(path, FileAccess.version(path))

    @staticmethod
    @lru_cache(maxsize=KEPT_FILES)
    def kept(path: Path, version: FileVersion) -> bytes:
        return FileAccess.binary(path)
