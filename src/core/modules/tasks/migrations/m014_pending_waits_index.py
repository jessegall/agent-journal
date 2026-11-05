from core.base.database.migration import Migration


class PendingWaitsIndexMigration(Migration):
    number = 14
    statements = tuple(["CREATE INDEX task_waits_pending ON task_waits (id, version, updated_at) WHERE ended_at IS NULL"])
