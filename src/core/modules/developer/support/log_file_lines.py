import re
from collections.abc import Iterator
from datetime import datetime, timezone
from pathlib import Path

from core.base.file_access import FileAccess
from core.modules.developer.support.log_level import LogLevel
from core.modules.developer.support.log_line import LogLine
from core.modules.developer.support.log_source import LogSource

CHUNK_BYTES = 256 * 1024
STAMPED_LINE = re.compile(r"^(\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?(?:Z|[+-]\d\d:\d\d)) (.*)$")


class LogFileLines:
    """Reads one log file from its end in chunks, so a page of the newest lines never reads the whole file. A line
    with no time of its own takes the time of the stamped line above it, as a traceback belongs to its error."""

    def __init__(self, path: Path) -> None:
        self.path = path
        self.bytes_read = 0

    def newest_first(self) -> Iterator[LogLine]:
        waiting: list[tuple[int, str]] = []
        for position, text in self.raw_lines():
            match = STAMPED_LINE.match(text)
            recorded_at = self.parsed_time(match[1]) if match else None
            if recorded_at is None:
                waiting.append((position, text))
                continue
            yield from (self.line(line_position, line_text, recorded_at, match[2]) for line_position, line_text in waiting)
            waiting = []
            yield self.line(position, text, recorded_at, match[2])
        modified_at = datetime.fromtimestamp(self.path.stat().st_mtime, timezone.utc).isoformat() if waiting else ""
        yield from (self.line(line_position, line_text, modified_at, line_text) for line_position, line_text in waiting)

    def raw_lines(self) -> Iterator[tuple[int, str]]:
        end = self.path.stat().st_size
        tail = b""
        while end > 0:
            start = max(0, end - CHUNK_BYTES)
            chunk = FileAccess.shared().bytes_range(self.path, start, end - start)
            self.bytes_read += len(chunk)
            parts = (chunk + tail).split(b"\n")
            tail = parts[0] if start > 0 else b""
            offset = start + len(parts[0]) + 1
            positions = []
            for part in parts[1:]:
                positions.append((offset, part))
                offset += len(part) + 1
            if start == 0:
                positions.insert(0, (0, parts[0]))
            for position, part in reversed(positions):
                if part:
                    yield position, part.decode(errors="replace")
            end = start

    @staticmethod
    def parsed_time(text: str) -> str | None:
        try:
            return datetime.fromisoformat(text).astimezone(timezone.utc).isoformat()
        except ValueError:
            return None

    def line(self, position: int, text: str, recorded_at: str, message: str) -> LogLine:
        is_server = self.path.name.startswith("server.log")
        source = LogSource.SERVER if is_server else (LogSource.ERROR if message.startswith("journal ") else LogSource.JOURNAL)
        level = LogLevel.parse_text(message, LogLevel.ERROR if source is LogSource.ERROR else LogLevel.INFORMATION)
        return LogLine(f"{self.path.name}@{position}", recorded_at, source, level, text)
