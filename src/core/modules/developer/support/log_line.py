from dataclasses import dataclass

from engine.enums.log_level import LogLevel
from engine.enums.log_source import LogSource


@dataclass(frozen=True)
class LogLine:
    id: str
    recorded_at: str
    source: LogSource
    level: LogLevel
    text: str
