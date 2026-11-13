from engine.database.migration import Migration


class ErasedDeletedSecretsMigration(Migration):
    """Erases the rows of secrets deleted before a deletion erased them, and drops the deleted mark and its index."""

    number = 3
    statements = ["DELETE FROM secrets WHERE deleted_at IS NOT NULL", "DROP INDEX secrets_active", "ALTER TABLE secrets DROP COLUMN deleted_at"]
