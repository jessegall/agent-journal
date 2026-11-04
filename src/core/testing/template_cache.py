import hashlib
import shutil
import time
from pathlib import Path

from core.base.module.code_fingerprint import CORE_FOLDER, CodeFingerprint

CACHE_FOLDER = Path.home() / ".cache" / "agent-journal" / "story-templates"
UNUSED_CHECKOUT_SECONDS = 7 * 24 * 3600
RUNNING_FOLDER_SECONDS = 3600
HASH_CHARACTERS = 16


class TemplateCache:
    """Caches migrated test databases for the current checkout. A run in progress can still be using an older
    folder, so only a folder unused for an hour is removed."""

    def __init__(self, root: Path = CACHE_FOLDER) -> None:
        self.root = root

    def folder(self) -> Path:
        checkout = self.root / hashlib.sha1(str(CORE_FOLDER).encode()).hexdigest()[:HASH_CHARACTERS]
        current = checkout / CodeFingerprint().folder_text([CORE_FOLDER.parent, CORE_FOLDER.parent.parent / "tests"])[:HASH_CHARACTERS]
        if not current.is_dir():
            self.remove_old(checkout)
        current.mkdir(parents=True, exist_ok=True)
        current.touch()
        checkout.touch()
        return current

    def remove_old(self, checkout: Path) -> None:
        run_limit = time.time() - RUNNING_FOLDER_SECONDS
        for older in (path for path in checkout.iterdir() if path.is_dir() and path.stat().st_mtime < run_limit) if checkout.is_dir() else ():
            shutil.rmtree(older, ignore_errors=True)
        limit = time.time() - UNUSED_CHECKOUT_SECONDS
        for unused in (path for path in self.root.iterdir() if path.is_dir() and path.stat().st_mtime < limit) if self.root.is_dir() else ():
            shutil.rmtree(unused, ignore_errors=True)
