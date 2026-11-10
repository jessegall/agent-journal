from collections.abc import Mapping

from engine.database.database import Database
from engine.database.statement import Statement


class RowInsert:
    """Writes a row straight into a version 5 table for the upgrade, with the id it names or a new one, sets a
    row's state or one value, and finds a moved row's id by its name; the table's triggers still judge every
    write."""

    def __init__(self, database: Database) -> None:
        self.database = database

    def insert(self, table: str, values: Mapping[str, object]) -> int:
        columns = list(values)
        return self.database.insert(Statement(f"INSERT INTO {table} ({', '.join(columns)}) VALUES ({', '.join('?' for _ in columns)})", [values[name] for name in columns]))

    def set_value(self, table: str, row_id: int, column: str, value: object) -> None:
        self.database.update(Statement(f"UPDATE {table} SET {column} = ? WHERE id = ?", (value, row_id)))

    def set_state(self, table: str, row_id: int, state: str) -> None:
        self.set_value(table, row_id, "state", state)

    def name_row_id(self, table: str, name: str) -> int | None:
        rows = self.database.rows(Statement(f"SELECT id FROM {table} WHERE name = ?", [name]))
        return int(rows[0]["id"]) if rows else None

    def matching_row_id(self, table: str, values: Mapping[str, object]) -> int | None:
        condition = " AND ".join(f"{column} IS ?" for column in values)
        rows = self.database.rows(Statement(f"SELECT id FROM {table} WHERE {condition} ORDER BY id LIMIT 1", tuple(values.values())))
        return int(rows[0]["id"]) if rows else None
