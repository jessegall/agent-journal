from engine.database.migration import Migration


class ClosedTaskIndexMigration(Migration):
    """Indexes closed task times within each environment."""

    number = 10
    statements = ["CREATE INDEX tasks_environment_closed ON tasks (environment_id, closed_at) WHERE closed_at IS NOT NULL"]
