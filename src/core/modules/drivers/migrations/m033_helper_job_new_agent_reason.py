from engine.database.migration import Migration


class HelperJobNewAgentReasonMigration(Migration):
    """Adds the reason a helper started new though another could take the job."""

    number = 33
    statements = ["ALTER TABLE helper_jobs ADD COLUMN fresh_reason TEXT NOT NULL DEFAULT ''"]
