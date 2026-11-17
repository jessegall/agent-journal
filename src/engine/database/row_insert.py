import re
from collections.abc import Mapping

from engine.database.database import Database
from engine.database.statement import Statement

LENGTH_RULE = re.compile(r"CHECK \(length\((\w+)\) (?:BETWEEN (\d+) AND (\d+)|>= (\d+)|> (\d+))\)")
TABLE_TEXT = "SELECT sql FROM sqlite_master WHERE type = 'table' AND name = ?"
SHORTENED_END = "…"
EMPTY_TEXT = "(empty in version 4)"


class RowInsert:
    """Writes a row straight into a version 5 table for the upgrade, with the id it names or a new one, sets a
    row's state or one value, and finds a moved row's id by its name; the table's triggers still judge every
    write. Version 4 held text longer or shorter than version 5's length rules allow, so a text is fitted to the
    table's rules as it is written: a long one is cut with an ellipsis and an empty one is named empty."""

    def __init__(self, database: Database) -> None:
        self.database = database
        self.table_limits: dict[str, dict[str, tuple[int, int | None]]] = {}

    def insert(self, table: str, values: Mapping[str, object]) -> int:
        fitted = self.fitted(table, values)
        columns = list(fitted)
        return self.database.insert(Statement(f"INSERT INTO {table} ({', '.join(columns)}) VALUES ({', '.join('?' for _ in columns)})", [fitted[name] for name in columns]))

    def set_value(self, table: str, row_id: int, column: str, value: object) -> None:
        self.database.update(Statement(f"UPDATE {table} SET {column} = ? WHERE id = ?", (self.fitted(table, {column: value})[column], row_id)))

    def set_state(self, table: str, row_id: int, state: str) -> None:
        self.set_value(table, row_id, "state", state)

    def name_row_id(self, table: str, name: str) -> int | None:
        rows = self.database.rows(Statement(f"SELECT id FROM {table} WHERE name = ?", [name]))
        return int(rows[0]["id"]) if rows else None

    def matching_row_id(self, table: str, values: Mapping[str, object]) -> int | None:
        condition = " AND ".join(f"{column} IS ?" for column in values)
        rows = self.database.rows(Statement(f"SELECT id FROM {table} WHERE {condition} ORDER BY id LIMIT 1", tuple(values.values())))
        return int(rows[0]["id"]) if rows else None

    def fitted(self, table: str, values: Mapping[str, object]) -> dict[str, object]:
        limits = self.limits(table)
        return {name: self.fitted_text(value, limits[name]) if name in limits and isinstance(value, str) else value for name, value in values.items()}

    @staticmethod
    def fitted_text(text: str, limit: tuple[int, int | None]) -> str:
        shortest, longest = limit
        if len(text) < shortest:
            text = EMPTY_TEXT
        if longest is not None and len(text) > longest:
            return text[:longest - len(SHORTENED_END)] + SHORTENED_END
        return text

    def limits(self, table: str) -> dict[str, tuple[int, int | None]]:
        if table not in self.table_limits:
            rows = self.database.rows(Statement(TABLE_TEXT, [table]))
            text = str(rows[0]["sql"]) if rows else ""
            self.table_limits[table] = {match[1]: self.limit(match) for match in LENGTH_RULE.finditer(text)}
        return self.table_limits[table]

    @staticmethod
    def limit(match: re.Match[str]) -> tuple[int, int | None]:
        if match[2] is not None:
            return int(match[2]), int(match[3])
        if match[4] is not None:
            return int(match[4]), None
        return int(match[5]) + 1, None
