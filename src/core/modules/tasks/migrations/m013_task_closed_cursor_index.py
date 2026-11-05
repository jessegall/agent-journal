from core.base.database.migration import Migration


class TaskClosedCursorIndexMigration(Migration):
    """Indexes finished task pages by close timestamp and task ID."""

    number = 13
    statements = ["CREATE INDEX tasks_environment_state_closed ON tasks (environment_id, state, closed_at, id)"]
