import hashlib
import shutil
import time
from pathlib import Path

from core.base.module.code_fingerprint import CORE_FOLDER
from core.testing.story_code_fingerprint import STORY_FINGERPRINT

CACHE_FOLDER = Path.home() / ".cache" / "agent-journal" / "story-templates"
UNUSED_CHECKOUT_SECONDS = 7 * 24 * 3600
HASH_CHARACTERS = 16


class TemplateCache:
    """The folder that keeps the story templates between test runs: one per checkout and state of its
    source, so a changed source file means new templates and never a stale one. A newer folder replaces
    the older ones of its checkout, and the folders of a checkout unused for a week go, since a worker's
    worktree does not stay."""

    def __init__(self, root: Path = CACHE_FOLDER) -> None:
        self.root = root

    def folder(self) -> Path:
        checkout = self.root / hashlib.sha1(str(CORE_FOLDER).encode()).hexdigest()[:HASH_CHARACTERS]
        current = checkout / STORY_FINGERPRINT.folder_text([CORE_FOLDER.parent])[:HASH_CHARACTERS]
        if not current.is_dir():
            self.remove_old(checkout)
        current.mkdir(parents=True, exist_ok=True)
        checkout.touch()
        return current

    def remove_old(self, checkout: Path) -> None:
        for older in (path for path in checkout.iterdir() if path.is_dir()) if checkout.is_dir() else ():
            shutil.rmtree(older, ignore_errors=True)
        limit = time.time() - UNUSED_CHECKOUT_SECONDS
        for unused in (path for path in self.root.iterdir() if path.is_dir() and path.stat().st_mtime < limit) if self.root.is_dir() else ():
            shutil.rmtree(unused, ignore_errors=True)
