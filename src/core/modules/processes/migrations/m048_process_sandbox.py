from engine.database.database import Database
from engine.database.migration import Migration
from engine.database.statement import Statement


class ProcessSandboxMigration(Migration):
    number = 48
    statements = ["ALTER TABLE processes ADD COLUMN sandbox_level TEXT NOT NULL DEFAULT 'none'"]

    def run(self, database: Database) -> None:
        columns = database.rows(Statement("PRAGMA table_info(processes)"))
        if any(column["name"] == "sandbox_level" for column in columns):
            return
        super().run(database)
