from core.base.database.migration import Migration


class JobRunTimeMigration(Migration):
    """A scheduled job keeps when it last ran."""

    number = 3
    statements = ["ALTER TABLE scheduled_jobs ADD COLUMN last_run_at TEXT"]
