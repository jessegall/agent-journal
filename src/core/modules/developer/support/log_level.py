import re
from enum import StrEnum


class LogLevel(StrEnum):
    DEBUG = "debug"
    INFORMATION = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"

    @classmethod
    def parse_text(cls, text: str, fallback: "LogLevel") -> "LogLevel":
        match = re.match(r"\[?(DEBUG|INFO|WARNING|ERROR|CRITICAL)\b", text, re.IGNORECASE)
        return cls(match[1].lower()) if match else fallback
