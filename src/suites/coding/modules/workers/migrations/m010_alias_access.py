from engine.database.migration import Migration
from engine.database.database import Database
from engine.database.statement import Statement


class AliasAccessMigration(Migration):
    """Preserves existing worker alias permissions under the generic access flag."""

    number = 10
    statements = ["UPDATE aliases SET agent_access = worker_access", "ALTER TABLE aliases DROP COLUMN worker_access"]

    def run(self, database: Database) -> None:
        if any(row["name"] == "worker_access" for row in database.rows(Statement("PRAGMA table_info(aliases)"))):
            super().run(database)
