from dataclasses import dataclass

from core.base.database.statement import Statement


@dataclass(frozen=True)
class Prefix:
    """Matches rows whose text column opens on the given words, taken literally."""

    column: str
    prefix: str

    def statement(self) -> Statement:
        return Statement(f"substr({self.column}, 1, ?) = ?", [len(self.prefix), self.prefix])
