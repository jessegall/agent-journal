import json

from core.base.file_access import FileAccess
from pathlib import Path

from core.base.journal_home import JournalHome

RECORDINGS_KEPT = 40


class MarkMotionFile:
    """The recordings of chat marks opening and closing, one JSON line each, the newest last."""

    def __init__(self, home: JournalHome) -> None:
        self.path: Path = home.system_log.parent / "mark-motions.jsonl"

    def add_all(self, recordings: str) -> None:
        lines = [*self.text().splitlines(), *(json.dumps(recording) for recording in json.loads(recordings))][-RECORDINGS_KEPT:]
        self.path.parent.mkdir(parents=True, exist_ok=True)
        FileAccess.shared().write(self.path, "\n".join(lines) + "\n")

    def text(self) -> str:
        return FileAccess.shared().read(self.path) if self.path.exists() else ""
