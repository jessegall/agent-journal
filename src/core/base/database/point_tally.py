import math
import sqlite3
from collections.abc import Sequence
from dataclasses import dataclass

BYTES_PER_KILOBYTE = 1024


@dataclass(frozen=True)
class Points:
    """What a stretch of work cost the database: the rows it loaded, the writes it made and the kilobytes it loaded,
    each one point."""

    rows: int = 0
    writes: int = 0
    kilobytes: int = 0

    @property
    def total(self) -> int:
        return self.rows + self.writes + self.kilobytes

    def since(self, earlier: "Points") -> "Points":
        return Points(self.rows - earlier.rows, self.writes - earlier.writes, self.kilobytes - earlier.kilobytes)

    def line(self) -> str:
        return f"{self.rows} rows, {self.writes} writes, {self.kilobytes} KB"


class PointTally:
    """Counts the points the database is asked for as they happen: a row loaded, a write and a started kilobyte loaded."""

    def __init__(self) -> None:
        self.rows, self.writes, self.bytes = 0, 0, 0

    def loaded(self, rows: Sequence[sqlite3.Row]) -> None:
        self.rows += len(rows)
        self.bytes += sum(len(value) for row in rows for value in row if isinstance(value, (str, bytes)))

    def wrote(self) -> None:
        self.writes += 1

    def points(self) -> Points:
        return Points(self.rows, self.writes, math.ceil(self.bytes / BYTES_PER_KILOBYTE))
