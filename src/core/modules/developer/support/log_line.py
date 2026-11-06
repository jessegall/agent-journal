from dataclasses import dataclass

from core.modules.developer.support.log_level import LogLevel
from core.modules.developer.support.log_source import LogSource


@dataclass(frozen=True)
class LogLine:
    id: str
    recorded_at: str
    source: LogSource
    level: LogLevel
    text: str
