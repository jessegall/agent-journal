from core.base.database.migration import Migration


class HelperJobHaltedSecondsMigration(Migration):
    """Adds the seconds a helper's job spent stopped at its program's usage limit, left out of the job's time limit."""

    number = 51
    statements = ["ALTER TABLE helper_jobs ADD COLUMN halted_seconds REAL NOT NULL DEFAULT 0"]
