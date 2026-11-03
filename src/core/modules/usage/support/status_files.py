import json
import shutil
import time
from pathlib import Path

from core.base.journal_home import JournalHome
from core.modules.usage.support.plan_window import PlanWindow
from core.modules.usage.support.session_status import SessionStatus

PLAN_FILE = "plan.json"
ENDED_FOLDER = "ended"
ENDED_KEPT_SECONDS = 30 * 24 * 3600


class StatusFiles:
    """The status files the hook program keeps of each session's status line, read for usage: one session's
    report, and the plan's windows, which belong to the account, from the newest file of an open session that
    names them, else from plan.json, where a session that ended left the windows it named. The file of a session
    that ended moves to a folder of its own for 30 days, so its card keeps its cost and the scan of open sessions
    does not read it."""

    def __init__(self, home: JournalHome) -> None:
        self.folder = home.status_folder
        self.plan_file = self.folder / PLAN_FILE
        self.ended_folder = self.folder / ENDED_FOLDER

    def status(self, session: str) -> SessionStatus:
        path = self.folder / f"{session}.json"
        return self.reported(path if path.is_file() else self.ended_folder / f"{session}.json")

    def plan_windows(self) -> tuple[PlanWindow, ...]:
        files = sorted((path for path in self.folder.glob("*.json") if path != self.plan_file), key=lambda path: path.stat().st_mtime, reverse=True) if self.folder.is_dir() else []
        return next((windows for path in [*files, self.plan_file] if (windows := self.reported(path).windows)), ())

    def retire(self, session: str) -> None:
        path = self.folder / f"{session}.json"
        if not path.is_file():
            return
        if self.reported(path).windows and (not self.plan_file.exists() or path.stat().st_mtime >= self.plan_file.stat().st_mtime):
            shutil.copy2(path, self.plan_file)
        self.ended_folder.mkdir(exist_ok=True)
        self.prune_ended()
        path.replace(self.ended_folder / path.name)

    def prune_ended(self) -> None:
        oldest = time.time() - ENDED_KEPT_SECONDS
        for path in self.ended_folder.glob("*.json"):
            if path.stat().st_mtime < oldest:
                path.unlink(missing_ok=True)

    @staticmethod
    def reported(path: Path) -> SessionStatus:
        if not path.is_file():
            return SessionStatus()
        try:
            return SessionStatus.reported(json.loads(path.read_text() or "{}"))
        except json.JSONDecodeError:
            return SessionStatus()
