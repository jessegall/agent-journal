from engine.database.migration import Migration
from engine.database.database import Database


class AliasAccessMigration(Migration):
    """Preserves existing worker alias permissions under the generic access flag."""

    number = 10
    statements = ["UPDATE aliases SET agent_access = worker_access", "ALTER TABLE aliases DROP COLUMN worker_access"]

    def run(self, database: Database) -> None:
        if "worker_access" in self.column_names(database, "aliases"):
            super().run(database)
