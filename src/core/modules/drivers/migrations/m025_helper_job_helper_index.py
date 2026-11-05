from core.base.database.migration import Migration


class HelperJobHelperIndexMigration(Migration):
    """Indexes a helper's jobs, read whenever a job row is created."""

    number = 25
    statements = ["CREATE INDEX helper_jobs_helper ON helper_jobs (helper_id)"]
