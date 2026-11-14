from engine.database.migration import Migration


class HelperJobsClosedMigration(Migration):
    """A job of the removed path can no longer end, so each open one ends now."""

    number = 27
    statements = ["UPDATE helper_jobs SET ended_at = updated_at WHERE ended_at IS NULL"]
