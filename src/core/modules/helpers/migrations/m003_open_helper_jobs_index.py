from core.base.database.migration import Migration


class OpenHelperJobsIndexMigration(Migration):
    """Indexes the open jobs of a profile, which each helper start and send reads."""

    number = 3
    statements = ["CREATE INDEX IF NOT EXISTS helper_jobs_open_profile ON helper_jobs (profile) WHERE ended_at IS NULL"]
