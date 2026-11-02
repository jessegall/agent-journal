import json
from pathlib import Path

from core.base.journal_home import JournalHome
from core.modules.usage.support.plan_window import PlanWindow
from core.modules.usage.support.session_status import SessionStatus


class StatusFiles:
    """The status files the hook program keeps of each session's status line, read for usage: one session's
    report, and the plan's windows, which belong to the account, from the newest file that names them."""

    def __init__(self, home: JournalHome) -> None:
        self.folder = home.status_folder

    def status(self, session: str) -> SessionStatus:
        return self.reported(self.folder / f"{session}.json")

    def plan_windows(self) -> tuple[PlanWindow, ...]:
        files = sorted(self.folder.glob("*.json"), key=lambda path: path.stat().st_mtime, reverse=True) if self.folder.is_dir() else []
        return next((windows for path in files if (windows := self.reported(path).windows)), ())

    @staticmethod
    def reported(path: Path) -> SessionStatus:
        if not path.is_file():
            return SessionStatus()
        try:
            return SessionStatus.reported(json.loads(path.read_text() or "{}"))
        except json.JSONDecodeError:
            return SessionStatus()
