import json
import os
from core.base.file_access import FileAccess

from core.base.journal_home import JournalHome
from core.base.rotated_file import RotatedFile
from core.base.performance.performance_state import PerformanceState

TIMING_LOG_LIMIT_BYTES = 10_000_000


class TimingLog:
    """The file each answered request appends one JSON line to, in one write, so several processes can append
    to it at once; only the server, at its start and holding its lock, moves it aside to timing.log.1 once it
    is past its limit, so no writer ever loses a file."""

    def __init__(self, home: JournalHome, limit_bytes: int = TIMING_LOG_LIMIT_BYTES) -> None:
        self.path, self.limit_bytes = home.timing_log, limit_bytes
        self.state = PerformanceState(home)

    def write(self, fields: dict[str, object]) -> None:
        if not self.state.can_measure:
            return
        self.path.parent.mkdir(parents=True, exist_ok=True)
        with FileAccess.shared().descriptor_writer(self.path, os.O_WRONLY | os.O_APPEND | os.O_CREAT, 0o644) as descriptor:
            os.write(descriptor, (json.dumps(fields, separators=(",", ":")) + "\n").encode())

    def rotate(self) -> None:
        RotatedFile(self.path, self.limit_bytes).rotate()
