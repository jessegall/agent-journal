import os
from pathlib import Path

from engine.time.clock import Clock
from engine.process.process_ids import ProcessIds
from engine.file.file_access import FileAccess
from core.modules.tools.support.graph_stamp import GraphStamp

OUTPUT_FOLDER = "graphify-out"
STAMP_FILE = ".journal-refresh"
RUNNING_FILE = ".journal-running"
FAILED_FILE = ".journal-failed"
CLAIM_GRACE_SECONDS = 30


class GraphFiles:
    """The files the journal keeps in one folder's graphify-out: the stamp of the last refresh, the claim a
    running refresh holds, and the commit a refresh failed for. The folder ignores itself, so git never
    takes it in."""

    def __init__(self, folder: Path) -> None:
        self.folder = folder
        self.output = folder / OUTPUT_FOLDER

    @property
    def stamp_path(self) -> Path:
        return self.output / STAMP_FILE

    @property
    def running_path(self) -> Path:
        return self.output / RUNNING_FILE

    def stamp(self) -> GraphStamp | None:
        if not self.stamp_path.is_file():
            return None
        return GraphStamp.read(FileAccess.shared().read(self.stamp_path))

    def failed_commit(self) -> str:
        path = self.output / FAILED_FILE
        return FileAccess.shared().read(path).strip() if path.is_file() else ""

    def is_running(self, clock: Clock) -> bool:
        if not self.running_path.is_file():
            return False
        text = FileAccess.shared().read(self.running_path).strip()
        is_claimed = clock.epoch_seconds() - self.running_path.stat().st_mtime < CLAIM_GRACE_SECONDS if not text else ProcessIds.text_exists(text)
        if not is_claimed:
            self.running_path.unlink(missing_ok=True)
        return is_claimed

    def claim(self) -> bool:
        self.output.mkdir(parents=True, exist_ok=True)
        FileAccess.shared().write(self.output / ".gitignore", "*\n")
        try:
            with FileAccess.shared().descriptor_writer(self.running_path, os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600):
                return True
        except FileExistsError:
            return False

    def record_owner(self, pid: int) -> None:
        FileAccess.shared().write(self.running_path, str(pid))

    def release(self) -> None:
        self.running_path.unlink(missing_ok=True)
