import json
import os

from core.base.journal_home import JournalHome

TRAIL_LOG_LIMIT_BYTES = 10_000_000


class TrailLog:
    """The file each answered request appends one JSON line to, in one write, so several processes can append to
    it at once; only the server, at its start and holding its lock, moves it aside to trail.log.1 once it is
    past its limit, so no writer ever loses a file."""

    def __init__(self, home: JournalHome, limit_bytes: int = TRAIL_LOG_LIMIT_BYTES) -> None:
        self.path, self.limit_bytes = home.trail_log, limit_bytes

    def write(self, fields: dict[str, object]) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        descriptor = os.open(self.path, os.O_WRONLY | os.O_APPEND | os.O_CREAT, 0o644)
        try:
            os.write(descriptor, (json.dumps(fields, separators=(",", ":")) + "\n").encode())
        finally:
            os.close(descriptor)

    def rotate(self) -> None:
        if self.path.exists() and self.path.stat().st_size > self.limit_bytes:
            self.path.replace(self.path.with_name(self.path.name + ".1"))
