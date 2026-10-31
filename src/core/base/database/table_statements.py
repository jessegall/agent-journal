from core.base.database.statement import Statement
from core.base.model.table import Table
from core.base.moment import Moment

FIRST_VERSION = 1


class TableStatements:
    """Writes the SQL to insert, update, delete and read the rows of one model's table."""

    def __init__(self, table: Table) -> None:
        self.table = table

    def insert(self, row: dict[str, object], moment: Moment) -> Statement:
        values = {**{column: value for column, value in row.items() if column != "id" or value}, "version": FIRST_VERSION, "created_at": moment.text, "updated_at": moment.text}
        marks = ", ".join("?" for _ in values)
        return Statement(f"INSERT INTO {self.table.name} ({', '.join(values)}) VALUES ({marks})", tuple(values.values()))

    def update(self, row_id: int, version: int, changed: dict[str, object], moment: Moment) -> Statement:
        assignments = ", ".join(f"{column} = ?" for column in changed)
        prefix = f"{assignments}, " if changed else ""
        return Statement(f"UPDATE {self.table.name} SET {prefix}version = version + 1, updated_at = ? WHERE id = ? AND version = ?",
                         (*changed.values(), moment.text, row_id, version))

    def delete(self, row_id: int, version: int) -> Statement:
        return Statement(f"DELETE FROM {self.table.name} WHERE id = ? AND version = ?", (row_id, version))

    def read(self, row_id: int) -> Statement:
        return Statement(f"SELECT * FROM {self.table.name} WHERE id = ?", (row_id,))

    def count(self) -> Statement:
        return Statement(f"SELECT count(*) FROM {self.table.name}")

    def metadata_removal(self, module: str) -> Statement:
        key = f'$."{module}"'
        return Statement(f"UPDATE {self.table.name} SET metadata = json_remove(metadata, ?) WHERE json_type(metadata, ?) IS NOT NULL", (key, key))
