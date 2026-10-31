import hashlib
from collections.abc import Sequence
from pathlib import Path

from core.base.module.folder_listing import FolderListing
from core.base.module.module import Module
from core.base.version import CORE_VERSION

CORE_FOLDER = Path(__file__).resolve().parents[2]


class CodeFingerprint:
    """A hash of the core version and of every Python file in the core's folder and in each module's folder, by
    path, size and change time, so a run can tell that the registry was built from other code; a file that
    appears, changes or is gone is a change, never an error."""

    def text(self, modules: Sequence[type[Module]]) -> str:
        return self.folder_text([CORE_FOLDER, *(module.folder() for module in modules)])

    def folder_text(self, folders: Sequence[Path]) -> str:
        return self.files_text(FolderListing(folders).files())

    def files_text(self, files: Sequence[Path]) -> str:
        digest = hashlib.sha256(".".join(map(str, CORE_VERSION)).encode())
        for file in files:
            try:
                status = file.stat()
            except FileNotFoundError:
                continue
            digest.update(f"{file}:{status.st_size}:{status.st_mtime_ns}".encode())
        return digest.hexdigest()
