from engine.database.migration import Migration


class HelperJobReasonNameMigration(Migration):
    """Renames the column with the reason a helper started new to the plain name."""

    number = 34
    statements = ["ALTER TABLE helper_jobs RENAME COLUMN fresh_reason TO new_agent_reason"]
