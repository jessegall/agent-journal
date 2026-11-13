import os

from engine.file.file_access import FileAccess
from engine.journal.journal_home import JournalHome
from engine.process.process_ids import ProcessIds
from engine.time.clock import Clock

CLAIM_FILE = "graphify-running"
CLAIM_GRACE_SECONDS = 30


class ProjectGraphClaim:
    """The one claim of a Graphify update across the project, kept in the journal's runtime folder: a refresh of
    any folder holds it until its process ends, so the main checkout and the worktrees never update at once."""

    def __init__(self, home: JournalHome) -> None:
        self.path = home.folder / "runtime" / CLAIM_FILE

    def is_claimed(self, clock: Clock) -> bool:
        if not self.path.is_file():
            return False
        text = FileAccess.shared().read(self.path).strip()
        is_blocked = clock.epoch_seconds() - self.path.stat().st_mtime < CLAIM_GRACE_SECONDS if not text else ProcessIds.text_exists(text)
        if not is_blocked:
            self.path.unlink(missing_ok=True)
        return is_blocked

    def claim(self, clock: Clock) -> bool:
        if self.is_claimed(clock):
            return False
        self.path.parent.mkdir(parents=True, exist_ok=True)
        try:
            with FileAccess.shared().descriptor_writer(self.path, os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600):
                return True
        except FileExistsError:
            return False

    def record_owner(self, pid: int) -> None:
        FileAccess.shared().write(self.path, str(pid))

    def release(self) -> None:
        self.path.unlink(missing_ok=True)
