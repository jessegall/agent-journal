from engine.file.file_access import FileAccess
import fnmatch
import hashlib
import os
import shutil
from pathlib import Path

from engine.time.clock import Clock
from engine.file.code_copy import IGNORED, CodeCopy
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
        for folder, folders, files in FileAccess.walk_folders(source):
            folders[:] = sorted(name for name in folders if not self.is_ignored(name))
            for name in sorted(name for name in files if not self.is_ignored(name)):
                path = Path(folder) / name
                digest.update(str(path.relative_to(source)).encode())
                digest.update(FileAccess.binary(path))
        return digest.hexdigest()[:TAG_CHARACTERS]

    def is_ignored(self, name: str) -> bool:
        return any(fnmatch.fnmatch(name, pattern) for pattern in IGNORED)

    def add(self, source: Path, clock: Clock) -> str:
        tag = self.tag(source)
        if not FileAccess.is_dir(self.version(tag)):
            partial = self.version(tag + PARTIAL_VERSION)
            shutil.rmtree(partial, ignore_errors=True)
            FileAccess.mkdir(self.folder, parents=True, exist_ok=True)
            self.remove_stale_partials(clock)
            CodeCopy(source, self.home).write(partial)
            FileAccess.rename(partial, self.version(tag))
        return tag

    def remove_stale_partials(self, clock: Clock) -> None:
        for partial in FileAccess.glob(self.folder, f"*{PARTIAL_VERSION}"):
            if clock.epoch_seconds() - FileAccess.stat(partial).st_mtime > STALE_PARTIAL_SECONDS:
                shutil.rmtree(partial, ignore_errors=True)

    def switch(self, tag: str) -> None:
        if not FileAccess.is_dir(self.version(tag)):
            raise CodeVersionMissingError(tag)
        FileAccess.unlink(self.new_link, missing_ok=True)
        FileAccess.symlink_to(self.new_link, self.version(tag).relative_to(self.home.folder))
        running = self.running_version()
        if running not in ("", tag):
            FileAccess.write(self.previous_file, running)
        FileAccess.replace(self.new_link, self.link)
        self.prune()

    def running_version(self) -> str:
        if FileAccess.is_symlink(self.link):
            return self.link.resolve().name
        if not FileAccess.is_dir(self.link):
            return ""
        shutil.rmtree(self.version(FIRST_VERSION), ignore_errors=True)
        FileAccess.mkdir(self.folder, parents=True, exist_ok=True)
        FileAccess.rename(self.link, self.version(FIRST_VERSION))
        return FIRST_VERSION

    def prune(self) -> None:
        kept = {self.link.resolve().name, FileAccess.read(self.previous_file) if FileAccess.is_file(self.previous_file) else ""}
        for version in FileAccess.iterdir(self.folder):
            if FileAccess.is_dir(version) and version.suffix != PARTIAL_VERSION and version.name not in kept:
                shutil.rmtree(version)

    def install(self, source: Path, clock: Clock) -> None:
        if FileAccess.is_symlink(self.link):
            self.switch(self.add(source, clock))
        else:
            CodeCopy(source, self.home).make()
