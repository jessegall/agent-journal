from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True)
class StoredStackedState:
    """One frame as the stack row keeps it in JSON: its state's class name, the state's fields, its need key and when
    it entered the stack."""

    state_name: str
    state: Any
    state_key: Any
    entered_at: str
