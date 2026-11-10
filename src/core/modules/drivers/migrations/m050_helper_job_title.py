from core.base.database.migration import Migration


class HelperJobTitleMigration(Migration):
    """Adds the short title the sender gave a helper's job; a job from before has none."""

    number = 50
    statements = ["ALTER TABLE helper_jobs ADD COLUMN title TEXT NOT NULL DEFAULT ''"]
