from engine.file.file_access import FileAccess
import hashlib
import os
from collections.abc import Sequence
from pathlib import Path
from typing import ClassVar

from engine.journal.journal import Journal
from engine.module.folder_listing import FolderListing
from engine.module.module import Module
from engine.module.source_hash import SourceHash
from engine.version.version import CORE_VERSION

SOURCE_FOLDER = Path(__file__).resolve().parents[2]
BUILT_WINDOWS_FOLDER = Path("web") / "dist"
CORE_FOLDER = SOURCE_FOLDER / "core"
ENGINE_FOLDER = SOURCE_FOLDER / "engine"
PINNED_CODE_VARIABLE = "JOURNAL_PINNED_CODE_TEXT"


class CodeFingerprint:
    """A hash of the core version and of every Python file in the folders of the engine, the core and each
    module, by path, size and change time, so a run can tell that the registry came from other code; a file
    that appears, changes or is gone is a change, never an error. The folder listing of each set of folders is
    kept, so it is walked again only when a folder changed. A long running server's ticker refreshes the text,
    so a request reads the kept one and never the files; under unit tests, whose code does not change, the
    text uses relative paths and content hashes, so identical checkouts share test templates. A module's own
    text also counts its built window files, since it is the version
    on their addresses, which a browser keeps for a year."""

    ticked: ClassVar[bool] = False
    kept_texts: ClassVar[dict[tuple[Path, ...], str]] = {}

    def text(self, modules: Sequence[type[Module]]) -> str:
        folders = self.folders(modules)
        if (self.ticked or Journal.is_running_unit_tests()) and folders in self.kept_texts:
            return self.selected_text(self.kept_texts[folders], modules)
        return self.refreshed(modules)

    def refreshed(self, modules: Sequence[type[Module]]) -> str:
        folders = self.folders(modules)
        self.kept_texts[folders] = self.test_run_text(folders) if Journal.is_running_unit_tests() else self.folder_text(folders)
        return self.selected_text(self.kept_texts[folders], modules)

    @staticmethod
    def test_run_text(folders: tuple[Path, ...]) -> str:
        source_hash = os.environ.get(PINNED_CODE_VARIABLE)
        if source_hash is None:
            return SourceHash.text(folders)
        extra_folders = tuple(folder for folder in folders if SOURCE_FOLDER not in (folder, *folder.parents))
        return source_hash + SourceHash.text(extra_folders) if extra_folders else source_hash

    @staticmethod
    def selected_text(code_text: str, modules: Sequence[type[Module]]) -> str:
        digest = hashlib.sha256(code_text.encode())
        paths = sorted({f"{module.__module__}.{module.__qualname__}" for module in modules})
        digest.update(("\n" + "\n".join(paths)).encode())
        return digest.hexdigest()

    @staticmethod
    def folders(modules: Sequence[type[Module]]) -> tuple[Path, ...]:
        return (ENGINE_FOLDER, CORE_FOLDER, *(module.folder() for module in modules if not module.folder().is_relative_to(CORE_FOLDER)))

    def module_text(self, module: type[Module]) -> str:
        built_files = sorted(path for path in FileAccess.rglob(module.folder() / BUILT_WINDOWS_FOLDER, "*") if FileAccess.is_file(path))
        return self.files_text([*FolderListing.kept([module.folder()]).files(), *built_files])

    def folder_text(self, folders: Sequence[Path]) -> str:
        return self.files_text(FolderListing.kept(folders).files())

    def files_text(self, files: Sequence[Path]) -> str:
        digest = hashlib.sha256(".".join(map(str, CORE_VERSION)).encode())
        for file in files:
            try:
                status = FileAccess.stat(file)
            except FileNotFoundError:
                continue
            digest.update(f"{file}:{status.st_size}:{status.st_mtime_ns}".encode())
        return digest.hexdigest()
