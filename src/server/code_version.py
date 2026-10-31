import time

from core.base.module.code_fingerprint import CodeFingerprint
from core.base.module.folder_listing import FolderListing
from server.code_folders import CodeFolders


class CodeVersion:
    """The code the server started with, taken once before it imports anything else of its own; it is stale
    once a file in those folders is added, changed, moved or removed. The folders are listed again only when
    one of them changes, and every file is stat-ed at most once in recheck_seconds, so the check on every
    request stays cheap."""

    def __init__(self, fingerprint: CodeFingerprint, folders: CodeFolders, recheck_seconds: float = 0) -> None:
        self.fingerprint, self.listing = fingerprint, FolderListing(folders.folders())
        self.text = self.current_text()
        self.recheck_seconds, self.checked_seconds, self.code_changed = recheck_seconds, time.monotonic(), False

    def current_text(self) -> str:
        return self.fingerprint.files_text(self.listing.files())

    def is_stale(self) -> bool:
        clock_seconds = time.monotonic()
        if self.code_changed or clock_seconds - self.checked_seconds < self.recheck_seconds:
            return self.code_changed
        self.checked_seconds = clock_seconds
        self.code_changed = self.current_text() != self.text
        return self.code_changed
