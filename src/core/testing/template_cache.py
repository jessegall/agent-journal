import shutil
import time
from pathlib import Path

from core.base.module.code_fingerprint import CORE_FOLDER
from core.base.module.source_hash import SourceHash

CACHE_FOLDER = Path.home() / ".cache" / "agent-journal" / "story-templates"
RUNNING_FOLDER_SECONDS = 3600
HASH_CHARACTERS = 16


class TemplateCache:
    """Shares complete story templates across checkouts with identical sources."""

    def __init__(self, root: Path = CACHE_FOLDER) -> None:
        self.root = root

    def folder(self) -> Path:
        current = self.root / SourceHash.text((CORE_FOLDER.parent, CORE_FOLDER.parent.parent / "tests"))[:HASH_CHARACTERS]
        if not current.is_dir():
            self.remove_old()
        current.mkdir(parents=True, exist_ok=True)
        current.touch()
        return current

    def remove_old(self) -> None:
        limit = time.time() - RUNNING_FOLDER_SECONDS
        for folder in self.root.iterdir() if self.root.is_dir() else ():
            try:
                if folder.is_dir() and folder.stat().st_mtime < limit:
                    shutil.rmtree(folder, ignore_errors=True)
            except FileNotFoundError:
                continue
