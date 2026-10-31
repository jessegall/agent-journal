from collections.abc import Mapping

from core.base.database.database import Database
from core.base.database.statement import Statement


class RowInsert:
    """Writes a row straight into a version 5 table for the upgrade, with the id it names or a new one, and sets
    a row's state; the table's triggers still judge every write."""

    def __init__(self, database: Database) -> None:
        self.database = database

    def insert(self, table: str, values: Mapping[str, object]) -> int:
        columns = list(values)
        return self.database.insert(Statement(f"INSERT INTO {table} ({', '.join(columns)}) VALUES ({', '.join('?' for _ in columns)})", [values[name] for name in columns]))

    def set_state(self, table: str, row_id: int, state: str) -> None:
        self.database.update(Statement(f"UPDATE {table} SET state = ? WHERE id = ?", (state, row_id)))
