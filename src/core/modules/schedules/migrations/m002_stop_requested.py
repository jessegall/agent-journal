from core.base.database.migration import Migration


class StopRequestedMigration(Migration):
    """Names when a person asked to stop a job for what it holds."""

    number = 2
    statements = ["ALTER TABLE scheduled_jobs RENAME COLUMN stop_asked_at TO stop_requested_at"]
