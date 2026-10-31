from core.base.module.code_fingerprint import CodeFingerprint
from core.base.module.folder_listing import FolderListing
from server.code_folders import CodeFolders


class CodeVersion:
    """The code the server started with, taken once before it imports anything else of its own; it is stale once
    a file in those folders is added, changed, moved or removed. The folders are listed again only when one of
    them changes, so the check on every request stays cheap."""

    def __init__(self, fingerprint: CodeFingerprint, folders: CodeFolders) -> None:
        self.fingerprint, self.listing = fingerprint, FolderListing(folders.folders())
        self.text = self.current_text()

    def current_text(self) -> str:
        return self.fingerprint.files_text(self.listing.files())

    def is_stale(self) -> bool:
        return self.current_text() != self.text
