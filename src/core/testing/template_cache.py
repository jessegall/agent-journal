from core.base.file_access import FileAccess
import shutil
import time
from pathlib import Path

from core.base.module.code_fingerprint import CORE_FOLDER
from core.base.module.source_hash import SourceHash
from core.testing.folder_stat import FolderStat

CACHE_FOLDER = Path.home() / ".cache" / "agent-journal" / "story-templates"
RUNNING_FOLDER_SECONDS = 3600
CACHE_LIMIT_BYTES = 1024 ** 3
HASH_CHARACTERS = 16


class TemplateCache:
    """Shares complete story templates across checkouts with identical sources, and when a new one is made removes
    the ones unused for an hour and then the least recently used until the cache is under its size limit."""

    def __init__(self, root: Path = CACHE_FOLDER, limit_bytes: int = CACHE_LIMIT_BYTES) -> None:
        self.root, self.limit_bytes = root, limit_bytes

    def folder(self) -> Path:
        current = self.root / SourceHash.text((CORE_FOLDER.parent, CORE_FOLDER.parent.parent / "tests"))[:HASH_CHARACTERS]
        if not current.is_dir():
            self.remove_old()
        current.mkdir(parents=True, exist_ok=True)
        FileAccess.shared().update_timestamp(current)
        return current

    def remove_old(self) -> None:
        limit = time.time() - RUNNING_FOLDER_SECONDS
        for folder in self.root.iterdir() if self.root.is_dir() else ():
            if folder.is_dir() and FolderStat.modified_time(folder) < limit:
                shutil.rmtree(folder, ignore_errors=True)
        self.remove_oldest_templates()

    def remove_oldest_templates(self) -> None:
        sizes = {folder: FolderStat.bytes(folder) for folder in self.root.iterdir() if folder.is_dir()} if self.root.is_dir() else {}
        total = sum(sizes.values())
        for folder in sorted(sizes, key=FolderStat.modified_time):
            if total <= self.limit_bytes:
                break
            shutil.rmtree(folder, ignore_errors=True)
            total -= sizes[folder]
