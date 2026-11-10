import re
from collections.abc import Iterator
from datetime import datetime, timezone
from pathlib import Path

from engine.file.file_access import FileAccess
from engine.enums.log_level import LogLevel
from engine.enums.log_source import LogSource
from core.modules.developer.support.log_line import LogLine

BLOCK_BYTES = 256 * 1024
STAMPED_LINE = re.compile(r"^(\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?(?:Z|[+-]\d\d:\d\d)) (.*)$")
LOG_LINE_FIELDS = re.compile(rf"^({'|'.join(LogLevel)}) ({'|'.join(LogSource)}) (.*)$")


class LogFileLines:
    """Reads a log backwards in blocks, using the preceding timestamp for raw server output."""

    def __init__(self, path: Path) -> None:
        self.path = path
        self.bytes_read = 0

    def newest_first(self) -> Iterator[LogLine]:
        waiting: list[tuple[int, str]] = []
        for position, text in self.raw_lines():
            match = STAMPED_LINE.match(text)
            recorded_at = self.parsed_time(match[1]) if match else None
            if match is None or recorded_at is None:
                waiting.append((position, text))
                continue
            yield from (self.output_line(line_position, line_text, recorded_at) for line_position, line_text in waiting)
            waiting = []
            yield self.stamped_line(position, text, recorded_at, match[2])
        modified_at = datetime.fromtimestamp(self.path.stat().st_mtime, timezone.utc).isoformat() if waiting else ""
        yield from (self.output_line(line_position, line_text, modified_at) for line_position, line_text in waiting)

    def raw_lines(self) -> Iterator[tuple[int, str]]:
        end = self.path.stat().st_size
        tail = b""
        while end > 0:
            start = max(0, end - BLOCK_BYTES)
            block = FileAccess.shared().bytes_range(self.path, start, end - start)
            self.bytes_read += len(block)
            parts = (block + tail).split(b"\n")
            tail = parts[0] if start > 0 else b""
            offset = start + len(parts[0]) + 1
            positions: list[tuple[int, bytes]] = []
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

    def stamped_line(self, position: int, text: str, recorded_at: str, message: str) -> LogLine:
        match = LOG_LINE_FIELDS.match(message)
        if match is None:
            return self.output_line(position, text, recorded_at)
        return LogLine(f"{self.path.name}@{position}", recorded_at, LogSource(match[2]), LogLevel(match[1]), match[3])

    def output_line(self, position: int, text: str, recorded_at: str) -> LogLine:
        return LogLine(f"{self.path.name}@{position}", recorded_at, LogSource.SERVER, LogLevel.WARNING, text)
