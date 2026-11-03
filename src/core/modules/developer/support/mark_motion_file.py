from pathlib import Path

from core.base.journal_home import JournalHome

RECORDINGS_KEPT = 40


class MarkMotionFile:
    """The recordings of chat marks opening and closing, one JSON line each, the newest last."""

    def __init__(self, home: JournalHome) -> None:
        self.path: Path = home.error_log.parent / "mark-motions.jsonl"

    def add(self, frames: str) -> None:
        lines = [*self.text().splitlines(), frames][-RECORDINGS_KEPT:]
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.path.write_text("\n".join(lines) + "\n")

    def text(self) -> str:
        return self.path.read_text() if self.path.exists() else ""
