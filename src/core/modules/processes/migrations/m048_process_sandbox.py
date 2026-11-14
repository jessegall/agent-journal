from engine.database.database import Database
from engine.database.migration import Migration


class ProcessSandboxMigration(Migration):
    number = 48
    statements = ["ALTER TABLE processes ADD COLUMN sandbox_level TEXT NOT NULL DEFAULT 'none'"]

    def run(self, database: Database) -> None:
        if "sandbox_level" in self.column_names(database, "processes"):
            return
        super().run(database)
