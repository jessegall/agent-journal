from collections import Counter
from collections.abc import Sequence
from engine.database.points import Points
from engine.database.statement import Statement
import re
import sqlite3

STATEMENT_CHARACTERS = 300
TABLE_PATTERN = re.compile(r"\bFROM\s+(\w+)", re.IGNORECASE)
EVENT_LOG_PATTERN = re.compile(r"\s*INSERT\s+INTO\s+events\b", re.IGNORECASE)
COUNT_PATTERN = re.compile(r"\s*SELECT\s+count\(", re.IGNORECASE)


class PointTally:
    """Counts the points the database is asked for as they happen: a row loaded, a write and a
    started kilobyte loaded; a count of rows loads none, and the event log row of a write is
    part of that write."""

    def __init__(self) -> None:
        self.rows, self.writes, self.bytes = 0, 0, 0
        self.tables: Counter[str] = Counter()
        self.statements: Counter[str] = Counter()
        self.update_statements: Counter[str] = Counter()

    def mark_read(self) -> None:
        return

    def loaded(self, rows: Sequence[sqlite3.Row], statement: Statement) -> None:
        sql = statement.sql
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

    def add(self, points: Points) -> None:
        self.rows += points.rows
        self.writes += points.writes
        self.bytes += points.bytes
        self.tables.update(points.tables)
        self.statements.update(points.statements)
        self.update_statements.update(points.update_statements)

    def points(self) -> Points:
        return Points(self.rows, self.writes, self.bytes, Counter(self.tables), Counter(self.statements), Counter(self.update_statements))

