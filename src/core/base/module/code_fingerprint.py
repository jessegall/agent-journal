import hashlib
from collections.abc import Sequence
from pathlib import Path
from typing import ClassVar

from core.base.module.folder_listing import FolderListing
from core.base.module.module import Module
from core.base.version import CORE_VERSION

CORE_FOLDER = Path(__file__).resolve().parents[2]
BUILT_WINDOWS_FOLDER = Path("web") / "dist"


class CodeFingerprint:
    """A hash of the core version and of every Python file in the core's folder and in each module's folder,
    by path, size and change time, so a run can tell that the registry was built from other code; a file that
    appears, changes or is gone is a change, never an error. The folder listing of each set of folders is
    kept, so it is walked again only when a folder changed. A long running server's ticker refreshes the
    text, so a request reads the kept one and never the files. A module's own text also counts its built window
    files, since it is the version on their addresses, which a browser keeps for a year."""

    ticked: ClassVar[bool] = False
    kept_texts: ClassVar[dict[tuple[Path, ...], str]] = {}

    def __init__(self) -> None:
        self.listings: dict[tuple[Path, ...], FolderListing] = {}

    def text(self, modules: Sequence[type[Module]]) -> str:
        folders = self.folders(modules)
        if self.ticked and folders in self.kept_texts:
            return self.kept_texts[folders]
        return self.refreshed(modules)

    def refreshed(self, modules: Sequence[type[Module]]) -> str:
        folders = self.folders(modules)
        self.kept_texts[folders] = self.folder_text(folders)
        return self.kept_texts[folders]

    @staticmethod
    def folders(modules: Sequence[type[Module]]) -> tuple[Path, ...]:
        return (CORE_FOLDER, *(module.folder() for module in modules if not module.folder().is_relative_to(CORE_FOLDER)))

    def module_text(self, module: type[Module]) -> str:
        folders = [module.folder()]
        key = tuple(folders)
        if key not in self.listings:
            self.listings[key] = FolderListing(folders)
        built_files = sorted(path for path in (module.folder() / BUILT_WINDOWS_FOLDER).rglob("*") if path.is_file())
        return self.files_text([*self.listings[key].files(), *built_files])

    def folder_text(self, folders: Sequence[Path]) -> str:
        key = tuple(folders)
        if key not in self.listings:
            self.listings[key] = FolderListing(folders)
        return self.files_text(self.listings[key].files())

    def files_text(self, files: Sequence[Path]) -> str:
        digest = hashlib.sha256(".".join(map(str, CORE_VERSION)).encode())
        for file in files:
            try:
                status = file.stat()
            except FileNotFoundError:
                continue
            digest.update(f"{file}:{status.st_size}:{status.st_mtime_ns}".encode())
        return digest.hexdigest()
