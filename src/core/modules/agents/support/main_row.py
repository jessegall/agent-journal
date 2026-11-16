from collections.abc import Mapping
from dataclasses import dataclass

from core.modules.agents.support.main_place import MainPlace

MAIN_NUMBER = 1


@dataclass(frozen=True)
class MainRow:
    """The fields of a main agent row that decide a fold, read from the stored row while it still has the
    number column of journals from before plan 1140."""

    id: int
    environment_id: int
    number: int
    role: str
    ended_at: str | None

    @classmethod
    def parsed(cls, row: Mapping[str, object]) -> "MainRow":
        return cls(int(row["id"]), int(row["environment_id"]), int(row["number"]), str(row["role"]), None if row["ended_at"] is None else str(row["ended_at"]))

    @property
    def place(self) -> MainPlace:
        return MainPlace(self.id, self.environment_id, self.ended_at is None)
