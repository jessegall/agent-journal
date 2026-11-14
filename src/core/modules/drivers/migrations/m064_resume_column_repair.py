from engine.database.database import Database
from engine.database.migration import Migration
from engine.database.statement import Statement

OLD_COLUMN = "woken_at"


class ResumeColumnRepairMigration(Migration):
    """Renames the wake time column of context compactions in a database whose migration 63 was the retired one
    for helper job profile names, so the rename of number 63 never ran there."""

    number = 64
    statements = ["ALTER TABLE context_compactions RENAME COLUMN woken_at TO resumed_at"]

    def run(self, database: Database) -> None:
        if OLD_COLUMN in self.column_names(database, "context_compactions"):
            database.update(Statement(self.statements[0]))
