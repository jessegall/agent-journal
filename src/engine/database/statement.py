from collections.abc import Sequence
import sqlite3
from dataclasses import dataclass, field


@dataclass(frozen=True)
class Statement:
    """SQL text together with the values for its placeholders, the reason it may scan a table and the reason
    it may load a whole table past the read limit."""

    sql: str
    parameters: Sequence[object] = ()
    scan_reason: str | None = field(default=None, compare=False)
    full_table_reason: str | None = field(default=None, compare=False)
    named_limit_rows: int | None = field(default=None, compare=False)

    def __post_init__(self) -> None:
        object.__setattr__(self, "parameters", tuple(self.parameters))

    @property
    def is_false(self) -> bool:
        return self.sql == "0"

    @property
    def is_read(self) -> bool:
        return self.sql.lstrip().upper().startswith(("SELECT", "WITH", "EXPLAIN", "PRAGMA"))

    @property
    def is_schema_read(self) -> bool:
        return "FROM sqlite_master" in self.sql

    @property
    def is_limited_read(self) -> bool:
        return self.is_read and self.full_table_reason is None and not self.is_schema_read

    def joined(self, tail: "Statement", separator: str = " ") -> "Statement":
        return self.all_joined((self, tail), separator)

    @classmethod
    def row_state(cls, table: str, row_id: int) -> "Statement":
        return Statement(f"SELECT state FROM {table} WHERE id = ?", [row_id])

    @classmethod
    def all_joined(cls, statements: tuple["Statement", ...], separator: str) -> "Statement":
        reason = next((statement.scan_reason for statement in statements if statement.scan_reason is not None), None)
        return Statement(separator.join(statement.sql for statement in statements), tuple(parameter for statement in statements for parameter in statement.parameters), reason)

    def result(self, connection: sqlite3.Connection) -> sqlite3.Cursor:
        return connection.execute(self.sql, self.parameters)
