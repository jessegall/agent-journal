from engine.file.file_access import FileAccess
from engine.file.versions.file_version import FileVersion
import json
import shutil
from collections.abc import Sequence
from collections.abc import Mapping
from pathlib import Path

from engine.time.clock import Clock
from engine.journal.journal_home import ENDED_STATUS_FOLDER, JournalHome
from engine.provider.status_file_fields import StatusFileFields
from engine.time.timestamp import Timestamp
from core.modules.usage.support.plan_window import PlanWindow
from core.modules.usage.support.session_status import SessionStatus

PLAN_FILE = "plan.json"
ENDED_KEPT_SECONDS = 30 * 24 * 3600
READINESS_MAX_AGE_SECONDS = 24 * 3600


class StatusFiles:
    """The status files the hook program keeps of each session's status line, read for usage: one session's
    report, and the plan's windows. The windows belong to the account: they come from the newest file of an
    open session that names them; with no session open, from plan.json, where one that ended left what it
    named, so a session under a new account never shows the old account's figure. The file of a session that
    ended moves to a folder of its own for 30 days, so its card keeps its cost and the scan of open sessions
    does not read it."""

    def __init__(self, home: JournalHome, clock: Clock) -> None:
        self.clock = clock
        self.folder = home.status_folder
        self.plan_file = self.folder / PLAN_FILE
        self.ended_folder = self.folder / ENDED_STATUS_FOLDER

    def status(self, session: str) -> SessionStatus:
        path = self.folder / f"{session}.json"
        return self.reported(path if path.is_file() else self.ended_folder / f"{session}.json")

    def newest_status(self, sessions: Sequence[str], checked_at: Timestamp) -> SessionStatus:
        files = [self.folder / f"{session}.json" for session in sessions]
        newest = max((path for path in files if path.is_file()), key=lambda path: path.stat().st_mtime, default=None)
        if newest is None or checked_at.value.timestamp() - newest.stat().st_mtime >= READINESS_MAX_AGE_SECONDS:
            return SessionStatus()
        return self.status(newest.stem)

    def plan_windows(self, statuses: Mapping[str, SessionStatus]) -> tuple[PlanWindow, ...]:
        files = sorted((path for path in self.folder.glob("*.json") if path != self.plan_file), key=lambda path: path.stat().st_mtime, reverse=True) if self.folder.is_dir() else []
        return next((windows for path in files or [self.plan_file] if (windows := self.file_status(path, statuses).windows)), ())

    def file_status(self, path: Path, statuses: Mapping[str, SessionStatus]) -> SessionStatus:
        return statuses[path.stem] if path.stem in statuses else self.reported(path)

    def retire(self, session: str) -> None:
        path = self.folder / f"{session}.json"
        if not path.is_file():
            return
        if self.has_newest_windows(path):
            shutil.copy2(path, self.plan_file)
        self.ended_folder.mkdir(exist_ok=True)
        self.prune_ended()
        path.replace(self.ended_folder / path.name)

    def prune_ended(self) -> None:
        oldest = self.clock.epoch_seconds() - ENDED_KEPT_SECONDS
        for path in self.ended_folder.glob("*.json"):
            if path.stat().st_mtime < oldest:
                path.unlink(missing_ok=True)

    def has_newest_windows(self, path: Path) -> bool:
        if not self.reported(path).windows:
            return False
        return not self.plan_file.exists() or path.stat().st_mtime >= self.plan_file.stat().st_mtime

    @staticmethod
    def reported(path: Path) -> SessionStatus:
        try:
            return StatusFiles.kept_status(path, FileAccess.shared().version(path))
        except (FileNotFoundError, json.JSONDecodeError):
            return SessionStatus()

    @staticmethod
    def kept_status(path: Path, version: FileVersion) -> SessionStatus:
        return SessionStatus.reported(StatusFileFields.read(path, version))
