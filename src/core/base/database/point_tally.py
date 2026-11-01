import math
import re
import sqlite3
from collections.abc import Sequence
from collections import Counter
from dataclasses import dataclass, field

KILOBYTE_BYTES = 1024
TABLES_SHOWN = 3
STATEMENT_CHARACTERS = 300
TABLE_PATTERN = re.compile(r"\bFROM\s+(\w+)", re.IGNORECASE)
EVENT_LOG_PATTERN = re.compile(r"\s*INSERT\s+INTO\s+events\b", re.IGNORECASE)
COUNT_PATTERN = re.compile(r"\s*SELECT\s+count\(", re.IGNORECASE)


@dataclass(frozen=True)
class Points:
    """What a stretch of work cost the database: the rows it loaded, the writes it made and the
    kilobytes it loaded, each one point."""

    rows: int = 0
    writes: int = 0
    kilobytes: int = 0
    tables: Counter[str] = field(default_factory=lambda: Counter[str]())
    statements: Counter[str] = field(default_factory=lambda: Counter[str]())
    update_statements: Counter[str] = field(default_factory=lambda: Counter[str]())

    @property
    def total(self) -> int:
        return self.rows + self.writes + self.kilobytes

    def minus(self, base: "Points") -> "Points":
        return Points(self.rows - base.rows, self.writes - base.writes, self.kilobytes - base.kilobytes, self.tables - base.tables,
                      self.statements - base.statements, self.update_statements - base.update_statements)

    def line(self) -> str:
        costliest = ", ".join(f"{table} {rows}" for table, rows in self.tables.most_common(TABLES_SHOWN))
        return f"{self.rows} rows, {self.writes} writes, {self.kilobytes} KB: {costliest}" if costliest else f"{self.rows} rows, {self.writes} writes, {self.kilobytes} KB"


class PointTally:
    """Counts the points the database is asked for as they happen: a row loaded, a write and a
    started kilobyte loaded; a count of rows loads none, and the event log row of a write is
    part of that write."""

    def __init__(self) -> None:
        self.rows, self.writes, self.bytes = 0, 0, 0
        self.tables: Counter[str] = Counter()
        self.statements: Counter[str] = Counter()
        self.update_statements: Counter[str] = Counter()

    def loaded(self, rows: Sequence[sqlite3.Row], sql: str) -> None:
        if COUNT_PATTERN.match(sql):
            return
        self.rows += len(rows)
        table_match = TABLE_PATTERN.search(sql)
        self.tables[table_match.group(1) if table_match else "base"] += len(rows)
        self.statements[sql[:STATEMENT_CHARACTERS]] += len(rows)
        self.bytes += sum(len(value) for row in rows for value in row if isinstance(value, (str, bytes)))

    def count_write(self, sql: str) -> None:
        if EVENT_LOG_PATTERN.match(sql):
            return
        self.writes += 1
        self.update_statements[sql[:STATEMENT_CHARACTERS]] += 1

    def points(self) -> Points:
        return Points(self.rows, self.writes, math.ceil(self.bytes / KILOBYTE_BYTES), Counter(self.tables), Counter(self.statements), Counter(self.update_statements))
