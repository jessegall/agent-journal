from core.base.database.migration import Migration


class OpenCheckResultIndexMigration(Migration):
    """Indexes active checks by their last result and row order."""

    number = 6
    statements = ["CREATE INDEX checks_open_result ON checks (last_passed, id, task_wait_id) WHERE removed_at IS NULL"]
