import json
from pathlib import Path

from engine.database.database import Database
from engine.database.migration import Migration
from engine.journal.journal_home import JournalHome
from engine.private.private_folder import PrivateFolder
from engine.private.secret_values import SecretValues
from core.modules.secrets.models.support.secret_field import SecretField


class ErasedDeletedSecretsMigration(Migration):
    """Erases the secrets deleted before a deletion erased them, their values from the values file with the rows,
    and drops the deleted mark and its index."""

    number = 3
    statements = ["DELETE FROM secrets WHERE deleted_at IS NOT NULL", "DROP INDEX secrets_active", "ALTER TABLE secrets DROP COLUMN deleted_at"]

    def run(self, database: Database) -> None:
        database_file = self.database_file(database)
        if database_file:
            deleted = self.variables(database, "SELECT fields FROM secrets WHERE deleted_at IS NOT NULL")
            kept = self.variables(database, "SELECT fields FROM secrets WHERE deleted_at IS NULL")
            SecretValues(PrivateFolder(JournalHome(Path(database_file).parent))).erase(tuple(deleted - kept))
        super().run(database)

    def variables(self, database: Database, sql: str) -> set[str]:
        return {SecretField.parsed(raw).variable for row in self.selected(database, sql, []) for raw in json.loads(str(row[0]))}
