import json
from pathlib import Path

from core.base.journal_home import JournalHome
from core.modules.usage.support.plan_window import PlanWindow
from core.modules.usage.support.session_status import SessionStatus

PLAN_FILE = "plan.json"


class StatusFiles:
    """The status files the hook program keeps of each session's status line, read for usage: one session's
    report, and the plan's windows, which belong to the account, from the newest file of an open session that
    names them, else from plan.json, where a session that ended left the windows it named."""

    def __init__(self, home: JournalHome) -> None:
        self.folder = home.status_folder
        self.plan_file = self.folder / PLAN_FILE

    def status(self, session: str) -> SessionStatus:
        return self.reported(self.folder / f"{session}.json")

    def plan_windows(self) -> tuple[PlanWindow, ...]:
        files = sorted((path for path in self.folder.glob("*.json") if path != self.plan_file), key=lambda path: path.stat().st_mtime, reverse=True) if self.folder.is_dir() else []
        return next((windows for path in [*files, self.plan_file] if (windows := self.reported(path).windows)), ())

    def retire(self, session: str) -> None:
        path = self.folder / f"{session}.json"
        if not path.is_file():
            return
        if self.reported(path).windows and (not self.plan_file.exists() or path.stat().st_mtime >= self.plan_file.stat().st_mtime):
            path.replace(self.plan_file)
        path.unlink(missing_ok=True)

    @staticmethod
    def reported(path: Path) -> SessionStatus:
        if not path.is_file():
            return SessionStatus()
        try:
            return SessionStatus.reported(json.loads(path.read_text() or "{}"))
        except json.JSONDecodeError:
            return SessionStatus()
