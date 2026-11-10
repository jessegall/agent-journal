from core.base.file_access import FileAccess
from core.base.provider.status_file_fields import StatusFileFields
from engine.time.timestamp import Timestamp
from engine.types.type_guards import is_mapping
from dataclasses import dataclass
from pathlib import Path
from typing import Mapping


@dataclass(frozen=True)
class ContextWindow:
    """How full a session's context is, as its program's status file reports it."""

    used_percentage: int | None
    total_input_tokens: int | None
    read_at: Timestamp | None = None
    window_size_tokens: int | None = None

    @classmethod
    def read_status_file(cls, path: Path) -> "ContextWindow":
        if not path.is_file():
            return cls(None, None)
        version = FileAccess.shared().version(path)
        return cls.parsed(StatusFileFields.read(path, version), version.modified_timestamp())

    @classmethod
    def parsed(cls, fields: Mapping[str, object], read_at: Timestamp) -> "ContextWindow":
        window = fields.get("context_window")
        return cls(cls.number(window, "used_percentage"), cls.number(window, "total_input_tokens"), read_at, cls.number(window, "context_window_size"))

    @staticmethod
    def number(window: object, name: str) -> int | None:
        value = window.get(name) if is_mapping(window) else None
        return int(value) if isinstance(value, int | float) and not isinstance(value, bool) else None
