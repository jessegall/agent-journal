from dataclasses import dataclass

from core.base.database.statement import Statement


@dataclass(frozen=True)
class Among:
    """Matches rows whose column has one of the given values."""

    column: str
    values: tuple[object, ...]

    def statement(self) -> Statement:
        if not self.values:
            return Statement("0")
        return Statement(f"{self.column} IN ({', '.join('?' for _ in self.values)})", self.values)
