import os

from core.base.clock import Clock
from core.base.file_access import FileAccess
from core.base.journal_home import JournalHome
from engine.enums.log_level import LogLevel
from engine.enums.log_source import LogSource
from core.base.rotated_file import RotatedFile

LOG_LIMIT_BYTES = 10_000_000
LOG_FILE_MODE = 0o600
OUTPUT_DESCRIPTORS = (1, 2)


class SystemLogWriter:
    """The one writer of the system log: each line holds its time, level and source, and a log past its limit moves
    aside to a file ending in .1. A line in the file without them is raw output of the server's process."""

    def __init__(self, home: JournalHome, clock: Clock, limit_bytes: int = LOG_LIMIT_BYTES) -> None:
        self.path, self.clock, self.limit_bytes = home.system_log, clock, limit_bytes

    def write(self, level: LogLevel, text: str, source: LogSource = LogSource.JOURNAL) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.rotate(self.limit_bytes)
        stamp = self.clock.timestamp().value.isoformat(timespec="seconds")
        lines = "".join(f"{stamp} {level.value} {source.value} {line}\n" for line in text.splitlines() or [""])
        with FileAccess.shared().descriptor_writer(self.path, os.O_WRONLY | os.O_APPEND | os.O_CREAT, LOG_FILE_MODE) as descriptor:
            os.write(descriptor, lines.encode())

    def rotate(self, limit_bytes: int) -> None:
        inode = self.path.stat().st_ino if self.path.exists() else None
        if not RotatedFile(self.path, limit_bytes).rotate():
            return
        with FileAccess.shared().descriptor_writer(self.path, os.O_WRONLY | os.O_APPEND | os.O_CREAT, LOG_FILE_MODE) as descriptor:
            for output in OUTPUT_DESCRIPTORS:
                if os.fstat(output).st_ino == inode:
                    os.dup2(descriptor, output)
