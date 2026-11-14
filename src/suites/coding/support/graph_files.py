import os
from pathlib import Path

from engine.time.clock import Clock
from engine.process.process_ids import ProcessIds
from engine.file.file_access import FileAccess
from suites.coding.support.graph_stamp import GraphStamp

# an empty running mark counts as claimed this long, while its update is being started
CLAIM_GRACE_SECONDS = 30

OUTPUT_FOLDER = "graphify-out"
STAMP_FILE = ".journal-refresh"
RUNNING_FILE = ".journal-running"
FAILED_FILE = ".journal-failed"
REBUILD_LOCK_FILE = ".rebuild.lock"
CLUSTERED_FILE = ".journal-clustered"


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
        if not FileAccess.is_file(self.stamp_path):
            return None
        return GraphStamp.read(FileAccess.read(self.stamp_path))

    def refresh_age_seconds(self, clock: Clock) -> float | None:
        return clock.epoch_seconds() - FileAccess.stat(self.stamp_path).st_mtime if FileAccess.is_file(self.stamp_path) else None

    def clustering_age_seconds(self, clock: Clock) -> float | None:
        path = self.output / CLUSTERED_FILE
        return clock.epoch_seconds() - FileAccess.stat(path).st_mtime if FileAccess.is_file(path) else None

    def failed_commit(self) -> str:
        path = self.output / FAILED_FILE
        return FileAccess.read(path).strip() if FileAccess.is_file(path) else ""

    def is_running(self, clock: Clock) -> bool:
        if not FileAccess.is_file(self.running_path):
            return False
        text = FileAccess.read(self.running_path).strip()
        is_claimed = clock.epoch_seconds() - FileAccess.stat(self.running_path).st_mtime < CLAIM_GRACE_SECONDS if not text else ProcessIds.text_exists(text)
        if not is_claimed:
            FileAccess.unlink(self.running_path, missing_ok=True)
        return is_claimed

    def claim(self) -> bool:
        FileAccess.mkdir(self.output, parents=True, exist_ok=True)
        FileAccess.write(self.output / ".gitignore", "*\n")
        try:
            with FileAccess.descriptor_writer(self.running_path, os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600):
                return True
        except FileExistsError:
            return False

    def record_owner(self, pid: int) -> None:
        FileAccess.write(self.running_path, str(pid))

    def release(self) -> None:
        FileAccess.unlink(self.running_path, missing_ok=True)
