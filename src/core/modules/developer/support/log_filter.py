from dataclasses import dataclass

from core.base.log_level import LogLevel
from core.modules.developer.support.log_line import LogLine
from core.base.log_source import LogSource


@dataclass(frozen=True)
class LogFilter:
    sources: tuple[LogSource, ...]
    levels: tuple[LogLevel, ...]

    def matches(self, line: LogLine) -> bool:
        return (not self.sources or line.source in self.sources) and (not self.levels or line.level in self.levels)
