from engine.database.migration import Migration


class OpenTaskEdgeIndexMigration(Migration):
    """Indexes the targets of open task waits for dependency checks."""

    number = 12
    statements = ["CREATE INDEX task_waits_open_edges ON task_waits (task_id, target) WHERE ended_at IS NULL"]
