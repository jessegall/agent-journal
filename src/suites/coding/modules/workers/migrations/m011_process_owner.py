from core.base.database.rebuild_migration import RebuildMigration
from core.base.database.database import Database
from core.base.database.statement import Statement


class ProcessOwnerMigration(RebuildMigration):
    """Preserves the worker responsible for existing proof runs under generic agent ownership."""

    number = 11
    statements = ["UPDATE processes SET owner_agent_id = worker_id", "ALTER TABLE processes DROP COLUMN worker_id"]

    def run(self, database: Database) -> None:
        if any(row["name"] == "worker_id" for row in database.rows(Statement("PRAGMA table_info(processes)"))):
            super().run(database)
        database.update(Statement("UPDATE process_parts SET is_visible = 1 WHERE substr(text, 1, 20) = 'journal worker merge'"))
