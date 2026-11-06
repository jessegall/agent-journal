import re
from datetime import datetime, timezone
from pathlib import Path

from core.base.file_access import FileAccess
from core.base.journal_home import JournalHome
from core.base.page import Page
from core.modules.developer.support.log_filter import LogFilter
from core.modules.developer.support.log_level import LogLevel
from core.modules.developer.support.log_line import LogLine
from core.modules.developer.support.log_source import LogSource


class SystemLog:
    """Reads server messages, errors and journal notes together from their existing log files."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    def page(self, filters: LogFilter, number: int, size: int) -> Page[LogLine]:
        paths = (self.home.folder / "runtime" / "server.log", self.home.error_log)
        lines = [line for path in paths for kept in (path, path.with_name(path.name + ".1"))
                 for line in self.read_file(kept) if filters.matches(line)]
        lines.sort(key=lambda line: line.recorded_at, reverse=True)
        number, size = max(1, number), min(200, max(1, size))
        offset = (number - 1) * size
        return Page(tuple(lines[offset:offset + size]), number, size, len(lines))

    def read_file(self, path: Path) -> tuple[LogLine, ...]:
        if not path.is_file():
            return ()
        recorded_at = datetime.fromtimestamp(path.stat().st_mtime, timezone.utc).isoformat()
        source = LogSource.SERVER if path.name.startswith("server.log") else LogSource.JOURNAL
        level = LogLevel.INFORMATION
        lines: list[LogLine] = []
        for number, text in enumerate(FileAccess.shared().read(path, errors="replace").splitlines(), 1):
            match = re.match(r"^(\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?(?:Z|[+-]\d\d:\d\d)) (.*)$", text)
            if match:
                try:
                    recorded_at = datetime.fromisoformat(match[1]).astimezone(timezone.utc).isoformat()
                except ValueError:
                    match = None
            if match:
                if not path.name.startswith("server.log"):
                    source = LogSource.ERROR if match[2].startswith("journal ") else LogSource.JOURNAL
                level = LogLevel.ERROR if source is LogSource.ERROR else LogLevel.INFORMATION
            level = LogLevel.parse_text(match[2] if match else text, level)
            lines.append(LogLine(f"{path.name}:{number}", recorded_at, source, level, text))
        return tuple(reversed(lines))
