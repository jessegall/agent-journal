import os
import shutil
from pathlib import Path

from core.base.code_copy import CodeCopy
from core.base.journal_home import JournalHome

KEPT_VERSIONS = 2
PARTIAL_SUFFIX = ".partial"
FIRST_VERSION = "first"
NEW_LINK = "src.new"


class CodeVersions:
    """The journal's code in one folder for each version, with the home's src a link to the version that runs, so
    the next version is copied beside a running server without touching the files that server reads."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home
        self.folder = home.folder / "versions"
        self.link = home.folder / "src"

    def version(self, tag: str) -> Path:
        return self.folder / tag

    def add(self, source: Path, tag: str) -> Path:
        version, partial = self.version(tag), self.version(tag + PARTIAL_SUFFIX)
        if version.is_dir():
            return version
        shutil.rmtree(partial, ignore_errors=True)
        self.folder.mkdir(parents=True, exist_ok=True)
        CodeCopy(source, self.home).write(partial)
        partial.rename(version)
        return version

    def switch(self, tag: str) -> None:
        self.keep_real_folder()
        new_link = self.home.folder / NEW_LINK
        new_link.unlink(missing_ok=True)
        new_link.symlink_to(self.version(tag).relative_to(self.home.folder))
        os.replace(new_link, self.link)
        self.prune()

    def keep_real_folder(self) -> None:
        if self.link.is_dir() and not self.link.is_symlink():
            shutil.rmtree(self.version(FIRST_VERSION), ignore_errors=True)
            self.folder.mkdir(parents=True, exist_ok=True)
            self.link.rename(self.version(FIRST_VERSION))

    def prune(self) -> None:
        running = self.link.resolve()
        spare = [version for version in self.folder.resolve().iterdir() if version != running]
        newest = sorted((version for version in spare if version.suffix != PARTIAL_SUFFIX), key=lambda version: version.stat().st_mtime, reverse=True)
        for version in set(spare) - set(newest[:KEPT_VERSIONS - 1]):
            shutil.rmtree(version)
