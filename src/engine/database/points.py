from collections import Counter
from dataclasses import dataclass, field
import math

KILOBYTE_BYTES = 1024
TABLES_SHOWN = 3


@dataclass(frozen=True)
class Points:
    """What a stretch of work cost the database: the rows it loaded, the writes it made and each
    kilobyte started of what it loaded, each one point."""

    rows: int = 0
    writes: int = 0
    bytes: int = 0
    tables: Counter[str] = field(default_factory=lambda: Counter[str]())
    statements: Counter[str] = field(default_factory=lambda: Counter[str]())
    update_statements: Counter[str] = field(default_factory=lambda: Counter[str]())

    @property
    def kilobytes(self) -> int:
        return math.ceil(self.bytes / KILOBYTE_BYTES)

    @property
    def total(self) -> int:
        return self.rows + self.writes + self.kilobytes

    def minus(self, base: "Points") -> "Points":
        return Points(self.rows - base.rows, self.writes - base.writes, self.bytes - base.bytes, self.tables - base.tables,
                      self.statements - base.statements, self.update_statements - base.update_statements)

    def line(self) -> str:
        costliest = ", ".join(f"{table} {rows}" for table, rows in self.tables.most_common(TABLES_SHOWN))
        return f"{self.rows} rows, {self.writes} writes, {self.kilobytes} KB: {costliest}" if costliest else f"{self.rows} rows, {self.writes} writes, {self.kilobytes} KB"
