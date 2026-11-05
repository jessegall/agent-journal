from core.base.database.migration import Migration


class PendingTargetsIndexMigration(Migration):
    number = 3
    statements = tuple(["CREATE INDEX wait_targets_pending ON wait_targets (id, version, updated_at) WHERE resolved_at IS NULL"])
