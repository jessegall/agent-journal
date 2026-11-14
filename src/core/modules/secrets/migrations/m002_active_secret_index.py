from engine.database.migration import Migration


class ActiveSecretIndexMigration(Migration):
    """Indexes secrets that have not been deleted."""

    number = 2
    statements = ["CREATE INDEX secrets_active ON secrets (deleted_at, id) WHERE deleted_at IS NULL"]
