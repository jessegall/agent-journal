import re
from pathlib import Path

from engine.enums.log_level import LogLevel
from engine.file.file_access import FileAccess
from engine.file.file_lock import FileLock
from engine.file.kept_bytes import KeptBytes
from engine.file.private_folders import PrivateFolders
from engine.journal.journal_home import JournalHome
from engine.log.system_log_writer import SystemLogWriter
from engine.time.clock import Clock
from engine.provider.program_settings_writer import LOCK_NAME

COPY_MODE = 0o600
NEWEST_COPIES = 20
STAMP_FORMAT = "%Y%m%dT%H%M%SZ"
COPY_NAME = re.compile(r"^(?P<stamp>\d{8}T\d{6}Z)(?:-(?P<number>\d+))?-(?P<name>.+)$")
REJECTED_PREFIX = "rejected-"
PROJECT_PREFIX = "project-"


class ProgramSettingsBackup:
    """Copies the user's own settings files of an agent program into the journal's backups, private to their
    owner, only when they changed since the newest copy; it keeps the first copy and the newest 20 of each
    file."""

    def __init__(self, home: JournalHome, log: SystemLogWriter, clock: Clock) -> None:
        self.home, self.log, self.clock = home, log, clock

    def backup_copies(self, program: str, files: tuple[tuple[Path, bytes | None], ...]) -> tuple[Path, ...]:
        copies = (self.copied(program, path) if data is None else self._stored(program, path.name, data) for path, data in files)
        return tuple(copy for copy in copies if copy is not None)

    def copied(self, program: str, path: Path) -> Path | None:
        return self._copied(program, path, path.name)

    def project_copied(self, program: str, path: Path) -> Path | None:
        return self._copied(program, path, f"{PROJECT_PREFIX}{path.name}")

    def newest(self, program: str, name: str) -> Path | None:
        copies = self.copies(program, name)
        return copies[-1] if copies else None

    def copies(self, program: str, name: str) -> list[Path]:
        folder = self.home.program_settings_backups / program
        if not folder.is_dir():
            return []
        matching = [(match, copy) for copy in folder.iterdir() if (match := COPY_NAME.match(copy.name)) is not None and match["name"] == name]
        return [copy for match, copy in sorted(matching, key=lambda pair: (pair[0]["stamp"], int(pair[0]["number"] or 0)))]

    def _copied(self, program: str, path: Path, name: str) -> Path | None:
        if not path.is_file():
            return None
        try:
            data = KeptBytes.read(path)
        except OSError as error:
            self.log.write(LogLevel.WARNING, f"the backup of {self.shown(path)} failed: {error.strerror or error}")
            return None
        return self._stored(program, name, data)

    def _stored(self, program: str, name: str, data: bytes) -> Path | None:
        folder = PrivateFolders.made(self.home.program_settings_backups / program)
        with FileLock.locked(folder / LOCK_NAME):
            newest = self.newest(program, name)
            if newest is not None and KeptBytes.read(newest) == data:
                return None
            copy = self.free_name(folder, name)
            FileAccess.shared().write_whole(copy, data, COPY_MODE)
            self.prune(program, name)
            return copy

    def rejected(self, program: str, path: Path, data: bytes) -> Path:
        name = f"{REJECTED_PREFIX}{path.name}"
        folder = PrivateFolders.made(self.home.program_settings_backups / program)
        with FileLock.locked(folder / LOCK_NAME):
            copy = self.free_name(folder, name)
            FileAccess.shared().write_whole(copy, data, COPY_MODE)
            for stale in self.copies(program, name)[:-NEWEST_COPIES]:
                stale.unlink(missing_ok=True)
            return copy

    def free_name(self, folder: Path, name: str) -> Path:
        stamp = self.clock.timestamp().value.strftime(STAMP_FORMAT)
        candidates = (folder / (f"{stamp}-{name}" if number == 0 else f"{stamp}-{number}-{name}") for number in range(len(list(folder.iterdir())) + 1))
        return next(candidate for candidate in candidates if not candidate.exists())

    def prune(self, program: str, name: str) -> None:
        copies = self.copies(program, name)
        for stale in copies[1:-NEWEST_COPIES]:
            stale.unlink(missing_ok=True)

    @staticmethod
    def shown(path: Path) -> str:
        person_home = str(Path.home())
        return f"~{str(path).removeprefix(person_home)}" if str(path).startswith(f"{person_home}/") else str(path)
