from dataclasses import dataclass

from core.base.timestamp import Timestamp


@dataclass(frozen=True)
class OpenRow:
    """One active row that puts an overlay's rules over an agent's driver, with the time it last became active."""

    table: str
    row_id: int
    opened_at: Timestamp

    @property
    def ref(self) -> str:
        return f"{self.table}:{self.row_id}"
