from collections.abc import Mapping
from dataclasses import dataclass


@dataclass(frozen=True)
class MainRow:
    """The fields of a main agent row that decide a fold."""

    id: int
    environment_id: int
    number: int
    role: str
    ended_at: str | None

    @classmethod
    def from_row(cls, row: Mapping[str, object]) -> "MainRow":
        return cls(int(row["id"]), int(row["environment_id"]), int(row["number"]), str(row["role"]), None if row["ended_at"] is None else str(row["ended_at"]))
