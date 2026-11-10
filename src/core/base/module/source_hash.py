from core.base.file_access import FileAccess
import fnmatch
import hashlib
import os
from functools import cache
from pathlib import Path

from core.base.code_copy import IGNORED
from engine.version.version import CORE_VERSION


class SourceHash:
    """Hashes relative source paths and file contents, reading each file once per process."""

    @staticmethod
    @cache
    def text(folders: tuple[Path, ...]) -> str:
        digest = hashlib.sha256(".".join(map(str, CORE_VERSION)).encode())
        sources = sorted((root.name, SourceHash.folder_hash(root)) for root in set(folders))
        for name, content in sources:
            digest.update(name.encode() + b"\0")
            digest.update(content)
        return digest.hexdigest()

    @staticmethod
    @cache
    def folder_hash(root: Path) -> bytes:
        digest = hashlib.sha256()
        for folder, directories, files in os.walk(root):
            directories[:] = sorted(name for name in directories if not any(fnmatch.fnmatch(name, pattern) for pattern in IGNORED))
            for name in sorted(name for name in files if not any(fnmatch.fnmatch(name, pattern) for pattern in IGNORED)):
                path = Path(folder) / name
                content = SourceHash.file_hash(path)
                if content is None:
                    continue
                digest.update(path.relative_to(root).as_posix().encode() + b"\0")
                digest.update(content)
        return digest.digest()

    @staticmethod
    @cache
    def file_hash(path: Path) -> bytes | None:
        try:
            return hashlib.sha256(FileAccess.shared().binary(path)).digest()
        except FileNotFoundError:
            return None
