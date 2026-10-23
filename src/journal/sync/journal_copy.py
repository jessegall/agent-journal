from journal.db.schema import Schema
from journal.repositories.shared_tables import SharedTables
from sync_server.copied_row import CopiedRow


class JournalCopy:
    """This journal's shared rows as the team server takes them in a full copy: each row's stored values, every field stamped with the row's update time, and the highest number each shared table holds."""

    def __init__(self, tables: SharedTables) -> None:
        self.tables = tables

    def rows(self) -> list[CopiedRow]:
        return [CopiedRow(table, row.row_id, Schema.stored_values(row, None), {name: row.updated_at.timestamp() for name in Schema.stored_values(row, None)}) for table in self.tables.names() for row in self.tables.rows(table).rows()]

    def highest(self, rows: list[CopiedRow]) -> dict:
        return {table: max((row.row for row in rows if row.row_table == table), default=0) for table in self.tables.names()}
