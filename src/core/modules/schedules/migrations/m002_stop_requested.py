from engine.database.migration import Migration


class StopRequestedMigration(Migration):
    """Names when a user asked to stop a job for what it holds."""

    number = 2
    statements = ["ALTER TABLE scheduled_jobs RENAME COLUMN stop_asked_at TO stop_requested_at"]
