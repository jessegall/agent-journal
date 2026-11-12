from dataclasses import dataclass

from engine.database.statement import Statement


@dataclass(frozen=True)
class ColumnEqual:
    """Matches rows whose column equals another column, which may name the outer table of an inner query."""

    column: str
    other_column: str

    def statement(self) -> Statement:
        return Statement(f"{self.column} = {self.other_column}")
