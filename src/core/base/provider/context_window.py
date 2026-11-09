from core.base.type_guards import is_list, is_mapping
from dataclasses import dataclass
from typing import Mapping


@dataclass(frozen=True)
class ContextWindow:
    """How full a session's context is, as its program's status file reports it."""

    used_percentage: int | None
    total_input_tokens: int | None

    @classmethod
    def parsed(cls, fields: Mapping[str, object]) -> "ContextWindow":
        window = fields.get("context_window")
        return cls(cls.number(window, "used_percentage"), cls.number(window, "total_input_tokens"))

    @staticmethod
    def number(window: object, name: str) -> int | None:
        value = window.get(name) if is_mapping(window) else None
        return int(value) if isinstance(value, int | float) and not isinstance(value, bool) else None
