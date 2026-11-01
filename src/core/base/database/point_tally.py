import math
import re
import sqlite3
from collections.abc import Sequence
from collections import Counter
from dataclasses import dataclass, field

BYTES_PER_KILOBYTE = 1024
TABLES_SHOWN = 3
TABLE_PATTERN = re.compile(r"\bFROM\s+(\w+)", re.IGNORECASE)
COUNT_PATTERN = re.compile(r"\s*SELECT\s+count\(", re.IGNORECASE)


@dataclass(frozen=True)
class Points:
    """What a stretch of work cost the database: the rows it loaded, the writes it made and the kilobytes it loaded,
    each one point."""

    rows: int = 0
    writes: int = 0
    kilobytes: int = 0
    tables: Counter[str] = field(default_factory=Counter)

    @property
    def total(self) -> int:
        return self.rows + self.writes + self.kilobytes

    def since(self, earlier: "Points") -> "Points":
        return Points(self.rows - earlier.rows, self.writes - earlier.writes, self.kilobytes - earlier.kilobytes, self.tables - earlier.tables)

    def line(self) -> str:
        costliest = ", ".join(f"{table} {rows}" for table, rows in self.tables.most_common(TABLES_SHOWN))
        return f"{self.rows} rows, {self.writes} writes, {self.kilobytes} KB: {costliest}" if costliest else f"{self.rows} rows, {self.writes} writes, {self.kilobytes} KB"


class PointTally:
    """Counts the points the database is asked for as they happen: a row loaded, a write and a started kilobyte loaded;
    a count of rows loads none."""

    def __init__(self) -> None:
        self.rows, self.writes, self.bytes = 0, 0, 0
        self.tables: Counter[str] = Counter()

    def loaded(self, rows: Sequence[sqlite3.Row], sql: str) -> None:
        if COUNT_PATTERN.match(sql):
            return
        self.rows += len(rows)
        found = TABLE_PATTERN.search(sql)
        self.tables[found.group(1) if found else "other"] += len(rows)
        self.bytes += sum(len(value) for row in rows for value in row if isinstance(value, (str, bytes)))

    def wrote(self) -> None:
        self.writes += 1

    def points(self) -> Points:
        return Points(self.rows, self.writes, math.ceil(self.bytes / BYTES_PER_KILOBYTE), Counter(self.tables))
