from datetime import datetime, timezone

from journal.db.connection import Connection
from journal.db.migration import Migration
from journal.db.schema import Schema


class Migrator:
    def __init__(self, connection: Connection, schema: Schema, migrations: tuple[Migration, ...] = ()) -> None:
        self.connection, self.schema, self.migrations = connection, schema, migrations

    def pending(self) -> list[Migration]:
        done = self.schema.version()
        return sorted((m for m in self.migrations if m.number > done), key=lambda m: m.number)

    def run(self) -> list[Migration]:
        ran = self.pending()
        for migration in ran:
            with self.connection.transaction() as db:
                migration.apply(db)
                db.execute("INSERT INTO migrations (number, ran_at) VALUES (?, ?)", (migration.number, datetime.now(timezone.utc).isoformat()))
        return ran
