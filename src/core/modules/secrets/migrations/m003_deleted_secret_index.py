from core.base.database.migration import Migration


class DeletedSecretIndexMigration(Migration):
    """Indexes secrets by the time they were deleted."""

    number = 3
    statements = ["CREATE INDEX secrets_deleted ON secrets (deleted_at)"]
