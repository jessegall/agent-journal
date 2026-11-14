import hashlib
import json
import os
import stat
import tempfile
from collections.abc import Mapping
from pathlib import Path

from engine.file.file_access import FileAccess
from engine.file.file_lock import FileLock
from engine.file.kept_bytes import KeptBytes
from engine.file.private_folders import PrivateFolders
from engine.journal.journal_home import JournalHome
from engine.provider.program_settings import ProgramSettings
from engine.provider.settings_file import SettingsFile
from engine.types.type_guards import is_mapping

DIGESTS_MODE = 0o600
LOCK_NAME = ".lock"
LINK_SUFFIX = ".link"


class ProgramSettingsWriter:
    """Writes the journal's own settings files for an agent program whole, read-only and atomically, under a
    file lock, and remakes the links its folder keeps to the user's data."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    def write(self, settings: ProgramSettings) -> tuple[Path, ...]:
        with FileLock.locked(PrivateFolders.made(self.home.programs_folder) / LOCK_NAME):
            for folder in self._folders(settings):
                PrivateFolders.made(folder)
                self._remove_stale_temporaries(folder)
            changed_files = tuple(file for file in settings.files if self._differs(file))
            for file in changed_files:
                FileAccess.write_whole(file.path, file.data, file.mode)
            changed_links = tuple(link for link, target in settings.links.items() if self._link_differs(link, target))
            for link in changed_links:
                self._relink(link, settings.links[link])
            self._record_digests(changed_files)
            return tuple(file.path for file in changed_files) + changed_links

    def differences(self, settings: ProgramSettings) -> tuple[Path, ...]:
        changed_files = tuple(file.path for file in settings.files if self._differs(file))
        return changed_files + tuple(link for link, target in settings.links.items() if self._link_differs(link, target))

    def recorded_digests(self) -> dict[str, str]:
        if not FileAccess.is_file(self.home.program_settings_digests):
            return {}
        recorded = json.loads(FileAccess.read(self.home.program_settings_digests))
        return {str(path): str(digest) for path, digest in recorded.items()} if is_mapping(recorded) else {}

    @staticmethod
    def _folders(settings: ProgramSettings) -> tuple[Path, ...]:
        return tuple(dict.fromkeys([*(file.path.parent for file in settings.files), *(link.parent for link in settings.links)]))

    @staticmethod
    def _remove_stale_temporaries(folder: Path) -> None:
        for stale in FileAccess.glob(folder, f"{tempfile.gettempprefix()}*"):
            if FileAccess.is_symlink(stale) or FileAccess.is_file(stale):
                FileAccess.unlink(stale, missing_ok=True)

    @staticmethod
    def _differs(file: SettingsFile) -> bool:
        if FileAccess.is_symlink(file.path) or not FileAccess.is_file(file.path):
            return True
        if stat.S_IMODE(FileAccess.stat(file.path).st_mode) != file.mode:
            return True
        return KeptBytes.read(file.path) != file.data

    @staticmethod
    def _link_differs(link: Path, target: Path) -> bool:
        return not FileAccess.is_symlink(link) or FileAccess.readlink(link) != target

    @staticmethod
    def _relink(link: Path, target: Path) -> None:
        temporary_link = link.parent / f"{tempfile.gettempprefix()}{link.name}{LINK_SUFFIX}"
        FileAccess.symlink_to(temporary_link, target)
        try:
            FileAccess.replace(temporary_link, link)
        finally:
            FileAccess.unlink(temporary_link, missing_ok=True)

    def _record_digests(self, files: tuple[SettingsFile, ...]) -> None:
        if not files:
            return
        digests: Mapping[str, str] = {**self.recorded_digests(), **{str(file.path): hashlib.sha256(file.data).hexdigest() for file in files}}
        PrivateFolders.made(self.home.program_settings_digests.parent)
        FileAccess.write_whole(self.home.program_settings_digests, (json.dumps(digests, indent=2, sort_keys=True) + "\n").encode(), DIGESTS_MODE)
