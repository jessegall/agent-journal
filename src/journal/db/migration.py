from typing import ClassVar

from journal.db.connection import Connection
from journal.models.outgoing_change import OutgoingChange


class Migration:
    """One numbered change to the database after the schema was first created: its statements, run in order, or an up of its own, with a column renamed in place of the empty one the schema already added, and renamed too in every write of that table still waiting for the team server, so it is sent under the new name."""

    number: ClassVar[int]
    statements: ClassVar[tuple[str, ...]] = ()

    def apply(self, connection: Connection) -> None:
        for statement in self.statements:
            connection.execute(statement)

    @staticmethod
    def column_rename(connection: Connection, table: str, old: str, new: str) -> None:
        present = {row["name"] for row in connection.all(f"PRAGMA table_info({table})")}
        if old not in present:
            return
        if new in present:
            connection.execute(f"ALTER TABLE {table} DROP COLUMN {new}")
        connection.execute(f"ALTER TABLE {table} RENAME COLUMN {old} TO {new}")
        Migration.queue_rename(connection, table, old, new)

    @staticmethod
    def queue_rename(connection: Connection, table: str, old: str, new: str) -> None:
        queue = OutgoingChange.table()
        if not connection.all(f"PRAGMA table_info({queue})"):
            return
        for column in ("fields", "changed_at"):
            connection.execute(f"UPDATE {queue} SET {column} = json_remove(json_set({column}, '$.' || ?, json({column} -> ('$.' || ?))), '$.' || ?) WHERE row_table = ? AND json_type({column}, '$.' || ?) IS NOT NULL", (new, old, old, table, old))
