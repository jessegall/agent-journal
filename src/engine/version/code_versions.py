from core.base.file_access import FileAccess
import fnmatch
import hashlib
import os
import shutil
from pathlib import Path

from engine.time.clock import Clock
from core.base.code_copy import IGNORED, CodeCopy
from engine.errors.code_version_missing_error import CodeVersionMissingError
from engine.journal.journal_home import JournalHome

PARTIAL_VERSION = ".partial"
FIRST_VERSION = "first"
NEW_LINK = "src.new"
PREVIOUS_FILE = "previous"
TAG_CHARACTERS = 16
STALE_PARTIAL_SECONDS = 3600


class CodeVersions:
    """The journal's code in one folder for each version, named by a digest of its files, with the home's src
    a link to the version that runs, so the next version is copied beside a running server without touching
    the files that server reads. A complete version is never written to. The switch from a real src folder
    runs only once no server runs from that folder, as such a server reads the new files at its next import.
    A crash between the two steps of that switch leaves the new link, and the program that looks for src puts
    it in place."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home
        self.folder = home.folder / "versions"
        self.link = home.folder / "src"
        self.new_link = home.folder / NEW_LINK
        self.previous_file = self.folder / PREVIOUS_FILE

    def version(self, tag: str) -> Path:
        return self.folder / tag

    def tag(self, source: Path) -> str:
        digest = hashlib.sha256()
        for folder, folders, files in os.walk(source):
            folders[:] = sorted(name for name in folders if not self.is_ignored(name))
            for name in sorted(name for name in files if not self.is_ignored(name)):
                path = Path(folder) / name
                digest.update(str(path.relative_to(source)).encode())
                digest.update(FileAccess.shared().binary(path))
        return digest.hexdigest()[:TAG_CHARACTERS]

    def is_ignored(self, name: str) -> bool:
        return any(fnmatch.fnmatch(name, pattern) for pattern in IGNORED)

    def add(self, source: Path, clock: Clock) -> str:
        tag = self.tag(source)
        if not self.version(tag).is_dir():
            partial = self.version(tag + PARTIAL_VERSION)
            shutil.rmtree(partial, ignore_errors=True)
            self.folder.mkdir(parents=True, exist_ok=True)
            self.remove_stale_partials(clock)
            CodeCopy(source, self.home).write(partial)
            partial.rename(self.version(tag))
        return tag

    def remove_stale_partials(self, clock: Clock) -> None:
        for partial in self.folder.glob(f"*{PARTIAL_VERSION}"):
            if clock.epoch_seconds() - partial.stat().st_mtime > STALE_PARTIAL_SECONDS:
                shutil.rmtree(partial, ignore_errors=True)

    def switch(self, tag: str) -> None:
        if not self.version(tag).is_dir():
            raise CodeVersionMissingError(tag)
        self.new_link.unlink(missing_ok=True)
        self.new_link.symlink_to(self.version(tag).relative_to(self.home.folder))
        running = self.running_version()
        if running not in ("", tag):
            FileAccess.shared().write(self.previous_file, running)
        os.replace(self.new_link, self.link)
        self.prune()

    def running_version(self) -> str:
        if self.link.is_symlink():
            return self.link.resolve().name
        if not self.link.is_dir():
            return ""
        shutil.rmtree(self.version(FIRST_VERSION), ignore_errors=True)
        self.folder.mkdir(parents=True, exist_ok=True)
        self.link.rename(self.version(FIRST_VERSION))
        return FIRST_VERSION

    def prune(self) -> None:
        kept = {self.link.resolve().name, FileAccess.shared().read(self.previous_file) if self.previous_file.is_file() else ""}
        for version in self.folder.iterdir():
            if version.is_dir() and version.suffix != PARTIAL_VERSION and version.name not in kept:
                shutil.rmtree(version)

    def install(self, source: Path, clock: Clock) -> None:
        if self.link.is_symlink():
            self.switch(self.add(source, clock))
        else:
            CodeCopy(source, self.home).make()
