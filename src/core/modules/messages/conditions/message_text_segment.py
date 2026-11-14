from collections.abc import Sequence
from dataclasses import dataclass


@dataclass(frozen=True)
class MessageTextSegment:
    """Selects a bounded text segment and one extra character to detect continuation."""

    offset: int
    size: int

    def columns(self, columns: Sequence[str]) -> str:
        return ", ".join(f"substr(text, {self.offset + 1}, {self.size + 1}) AS text" if column == "text" else column
                         for column in columns)
