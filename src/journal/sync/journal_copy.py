from journal.db.schema import Schema
from journal.models.outgoing_change import DELETED, OutgoingChange
from journal.repositories.shared_tables import SharedTables
from journal.support.actor import Actor
from sync_server.copied_row import CopiedRow


class JournalCopy:
    """This journal's shared rows as the team server takes them in a full copy, each row's stored values with every field stamped with the row's update time and the highest number each shared table holds; and the team's full copy taken in place of them, the rows kept on this machine alone untouched and this machine's waiting writes laid on top, so what it has not sent yet still shows here."""

    def __init__(self, tables: SharedTables) -> None:
        self.tables = tables

    def rows(self) -> list[CopiedRow]:
        return [CopiedRow(table, row.row_id, Schema.stored_values(row, None), {name: row.updated_at.timestamp() for name in Schema.stored_values(row, None)}) for table in self.tables.names() for row in self.tables.rows(table).rows()]

    def highest(self, rows: list[CopiedRow]) -> dict:
        return {table: max((row.row for row in rows if row.row_table == table), default=0) for table in self.tables.names()}

    def replace(self, rows: tuple[CopiedRow, ...], waiting: list[OutgoingChange]) -> None:
        for table in self.tables.names():
            self.tables.rows(table).clear()
        for row in rows:
            if self.tables.has(row.row_table):
                self.tables.rows(row.row_table).pulled_creation(row.row, row.fields, Actor.system())
        for change in waiting:
            if self.tables.has(change.row_table):
                self.laid(change)

    def laid(self, change: OutgoingChange) -> None:
        rows = self.tables.rows(change.row_table)
        if change.action == DELETED:
            rows.pulled_deletion(change.row, Actor.system())
        elif not rows.pulled_update(change.row, change.fields or {}, Actor.system()):
            rows.pulled_creation(change.row, change.fields or {}, Actor.system())
